import { useEffect, useRef, useState } from "react";
import "./BirthdayPuzzle.css";

const LEVELS = [
  {
    id: "anniversary",
    eyebrow: "關卡 01 · 紀念日算術",
    question: "今年妳生日，是我們在一起的第幾天？",
    setup: "先把四位數答案寫成 abcd",
    formula: "d − c − b − a",
    choices: [3, 5, 7, 9],
    correctAnswer: 3,
    clue: 3,
    success: "記憶體讀取成功。戀愛腦偶爾還是很有用。",
  },
  {
    id: "grad-school",
    eyebrow: "關卡 02 · 截止日危機",
    question: "我們第一間申請的研究所，截止日期是幾月幾號？",
    setup: "把日期寫成 ab 月 cd 日",
    formula: "(a + b) × (c + d)",
    choices: [303, 333, 336, 363],
    correctAnswer: 333,
    clue: 333,
    success: "Deadline 倖存者認證通過。可喜可賀。",
  },
  {
    id: "forever-young",
    eyebrow: "關卡 03 · 年齡保密協定",
    question: "女生都說自己永遠幾歲？",
    setup: "把年齡寫成 ab",
    formula: "10 × a + b",
    choices: [16, 18, 21, 28],
    correctAnswer: 18,
    clue: 18,
    success: "系統已接受。身分證字號表示不予置評。",
  },
];

const WRONG_FEEDBACK = [
  "不對喔。數學老師在遠方打了一個噴嚏。",
  "答案很有創意，但機器無情地說：不行。",
  "差一點點——也可能差很多，總之再算一次。",
  "嗶嗶！這顆按鈕沒有藏線索，只有尷尬。",
  "宇宙收到妳的答案了，然後默默退件。",
];

function shuffle(values) {
  const shuffled = [...values];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function ClueShelf({ completedLevels }) {
  return (
    <div className="birthday-clue-shelf" aria-label="已收集的線索">
      {LEVELS.map((level, index) => {
        const unlocked = completedLevels.includes(index);
        return (
          <div
            className={`birthday-clue-slot ${unlocked ? "is-unlocked" : ""}`}
            key={level.id}
          >
            <span className="birthday-clue-slot-label">{String(index + 1).padStart(2, "0")}</span>
            <strong>{unlocked ? level.clue : "???"}</strong>
          </div>
        );
      })}
    </div>
  );
}

function ProgressMeter({ levelIndex }) {
  return (
    <div className="birthday-progress-wrap">
      <div className="birthday-progress-copy">
        <span>LEVEL {levelIndex + 1} / {LEVELS.length}</span>
        <span>{Math.round(((levelIndex + 1) / LEVELS.length) * 100)}%</span>
      </div>
      <div
        className="birthday-progress-track"
        role="progressbar"
        aria-valuemin="1"
        aria-valuemax={LEVELS.length}
        aria-valuenow={levelIndex + 1}
        aria-label={`第 ${levelIndex + 1} 關，共 ${LEVELS.length} 關`}
      >
        <span style={{ width: `${((levelIndex + 1) / LEVELS.length) * 100}%` }} />
      </div>
    </div>
  );
}

function QuizLevel({ level, choices, onCorrect, onWrong }) {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("選一個答案，看看命運會不會放水。");
  const [shakeCount, setShakeCount] = useState(0);
  const advanceTimer = useRef(null);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const chooseAnswer = (answer) => {
    if (status !== "idle") return;

    setSelected(answer);
    if (answer === level.correctAnswer) {
      setStatus("correct");
      setFeedback(level.success);
      onCorrect();
      return;
    }

    setStatus("wrong");
    setShakeCount((count) => count + 1);
    const joke = WRONG_FEEDBACK[Math.floor(Math.random() * WRONG_FEEDBACK.length)];
    setFeedback(`${joke} 這題線索鎖住了，準備前往下一題。`);
    advanceTimer.current = setTimeout(onWrong, 1100);
  };

  return (
    <article
      className={`birthday-quiz-card ${status === "correct" ? "is-complete" : ""} ${
        status === "wrong" ? "is-wrong" : ""
      }`}
      key={`${level.id}-${shakeCount}`}
    >
      <div className="birthday-card-corners" aria-hidden="true" />
      <p className="birthday-level-eyebrow">{level.eyebrow}</p>
      <h1>{level.question}</h1>

      <div className="birthday-formula-panel">
        <span>{level.setup}</span>
        <strong>{level.formula}</strong>
        <small>= ?</small>
      </div>

      <div className="birthday-answers" aria-label="答案選項">
        {choices.map((answer, index) => {
          const isSelected = selected === answer;
          const isCorrect = status === "correct" && answer === level.correctAnswer;
          return (
            <button
              type="button"
              key={answer}
              className={`birthday-answer ${isSelected ? "is-selected" : ""} ${
                isCorrect ? "is-correct" : ""
              }`}
              onClick={() => chooseAnswer(answer)}
              disabled={status !== "idle"}
              aria-label={`答案 ${answer}`}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              <strong>{answer}</strong>
            </button>
          );
        })}
      </div>

      <div
        className={`birthday-feedback ${status}`}
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true">{status === "correct" ? "★" : status === "wrong" ? "×" : "●"}</span>
        <p>{feedback}</p>
      </div>

      {status === "correct" && (
        <div className="birthday-unlocked" aria-label={`解鎖線索 ${level.clue}`}>
          <span>CLUE UNLOCKED</span>
          <strong>{level.clue}</strong>
          <i aria-hidden="true">★</i>
        </div>
      )}
    </article>
  );
}

function CompletionScreen({ completedLevels, onRestart }) {
  const [thankMessage, setThankMessage] = useState("");
  const [dodgeCount, setDodgeCount] = useState(0);
  const [runawayPosition, setRunawayPosition] = useState(null);

  const moveRunawayButton = () => {
    const buttonWidth = 132;
    const buttonHeight = 56;
    const edge = 12;
    const maxX = Math.max(edge, window.innerWidth - buttonWidth - edge);
    const maxY = Math.max(edge, window.innerHeight - buttonHeight - edge);

    setRunawayPosition({
      left: Math.round(edge + Math.random() * (maxX - edge)),
      top: Math.round(edge + Math.random() * (maxY - edge)),
    });
    setDodgeCount((count) => count + 1);
  };

  const handsomeScale = Math.min(1 + dodgeCount * 0.16, 1.8);
  const allCollected = completedLevels.length === LEVELS.length;

  return (
    <section className="birthday-finale" aria-labelledby="birthday-finale-title">
      <div className="birthday-trophy" aria-hidden="true">
        <span>{allCollected ? "★" : "×"}</span>
      </div>
      <p className="birthday-kicker">
        {allCollected ? "MISSION COMPLETE" : "MISSION INCOMPLETE"}
      </p>
      <h1 id="birthday-finale-title">
        {allCollected ? "三個線索，全數捕獲。" : "有線索逃走了。"}
      </h1>
      <p className="birthday-finale-copy">
        {allCollected
          ? "它們看起來像數字，也確實就是數字。至於要拿來做什麼——現在還不能說。"
          : "答錯的題目不會提供線索，所以有些數字繼續保持神祕。Bonus 關仍然照常開放。"}
      </p>

      <div className="birthday-final-clues" aria-label="收集完成的線索">
        {LEVELS.map((level, index) => {
          const unlocked = completedLevels.includes(index);
          return (
            <div
              className={unlocked ? "" : "is-missing"}
              key={level.id}
              style={{ "--reveal-delay": `${index * 120}ms` }}
            >
              <span>CLUE {String(index + 1).padStart(2, "0")}</span>
              <strong>{unlocked ? level.clue : "???"}</strong>
            </div>
          );
        })}
      </div>

      <p className="birthday-bonus-label">BONUS STAGE</p>
      <div className="birthday-final-actions">
        <div
          className="birthday-handsome-wrap"
          style={{ "--handsome-scale": handsomeScale }}
        >
          <button
            type="button"
            className="birthday-pixel-button primary birthday-handsome-button"
            onClick={() => setThankMessage("你已拿到這些數字，請到這個地址領取您今年的禮物。")}
          >
            謝謝帥哥 <span aria-hidden="true">♥</span>
          </button>
        </div>
        <button
          type="button"
          className="birthday-pixel-button birthday-runaway-button"
          onClick={moveRunawayButton}
          style={runawayPosition ? {
            position: "fixed",
            left: runawayPosition.left,
            top: runawayPosition.top,
          } : undefined}
          aria-label="謝謝白痴，這個按鈕會逃跑"
        >
          謝謝白痴
        </button>
      </div>
      {thankMessage && (
        <div className="birthday-location-hint" role="status">
          <span>NEXT CLUE</span>
          <strong>段 · 巷 · 號</strong>
          <p>{thankMessage}</p>
          <button type="button" onClick={onRestart}>再玩一次</button>
        </div>
      )}
    </section>
  );
}

export default function BirthdayPuzzle() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showFinale, setShowFinale] = useState(false);
  const [runId, setRunId] = useState(0);

  const [shuffledChoices, setShuffledChoices] = useState(() =>
    LEVELS.map((level) => shuffle(level.choices))
  );

  const currentLevel = LEVELS[levelIndex];
  const currentComplete = completedLevels.includes(levelIndex);

  const completeLevel = () => {
    setCompletedLevels((completed) => (
      completed.includes(levelIndex) ? completed : [...completed, levelIndex]
    ));
  };

  const skipAfterWrong = () => {
    advance();
  };

  const advance = () => {
    if (levelIndex === LEVELS.length - 1) {
      setShowFinale(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setLevelIndex((index) => index + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setLevelIndex(0);
    setCompletedLevels([]);
    setShowFinale(false);
    setRunId((id) => id + 1);
    setShuffledChoices(LEVELS.map((level) => shuffle(level.choices)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="birthday-page">
      <div className="birthday-scanlines" aria-hidden="true" />
      <div className="birthday-pixel-stars" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>

      <div className="birthday-shell">
        <header className="birthday-game-header">
          <div className="birthday-title-lockup">
            <div className="birthday-mini-cake" aria-hidden="true">
              <span>✦</span>
              <i />
            </div>
            <div>
              <p>BIRTHDAY SIDE QUEST</p>
              <strong>生日解謎機</strong>
            </div>
          </div>
          <div className="birthday-status-light">
            <span /> ONLINE
          </div>
        </header>

        {!showFinale ? (
          <>
            <ProgressMeter levelIndex={levelIndex} />
            <ClueShelf completedLevels={completedLevels} />
            <QuizLevel
              key={`${currentLevel.id}-${runId}`}
              level={currentLevel}
              choices={shuffledChoices[levelIndex]}
              onCorrect={completeLevel}
              onWrong={skipAfterWrong}
            />

            <div className="birthday-next-wrap">
              <button
                type="button"
                className="birthday-pixel-button primary"
                onClick={advance}
                disabled={!currentComplete}
              >
                {levelIndex === LEVELS.length - 1 ? "查看戰利品" : "進入下一關"}
                <span aria-hidden="true">→</span>
              </button>
              {!currentComplete && <small>答對之後，傳送門才會通電。</small>}
            </div>
          </>
        ) : (
          <CompletionScreen completedLevels={completedLevels} onRestart={restart} />
        )}

        <footer className="birthday-game-footer">
          <span>NO CHEAT CODES REQUIRED</span>
          <span>© BIRTHDAY LAB</span>
        </footer>
      </div>
    </main>
  );
}
