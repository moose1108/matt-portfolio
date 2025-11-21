import requests
from bs4 import BeautifulSoup
import json

url = "https://zh.wikipedia.org/wiki/%E5%8F%B0%E5%8C%97%E6%8D%B7%E9%81%8B%E8%BB%8A%E7%AB%99%E5%88%97%E8%A1%A8"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
}

resp = requests.get(url, headers=headers)
resp.encoding = "utf-8"
soup = BeautifulSoup(resp.text, "html.parser")

tables = soup.select("table.wikitable")
stations = []

for table in tables:
    rows = table.select("tr")[1:]  # skip header row
    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 2:
            continue
        name_zh = cols[1].get_text(strip=True)
        stations.append(name_zh)

# 轉成去重（維基某些路線交會站會重複）
stations = list(dict.fromkeys(stations))

# 儲存 JSON
with open("taipei_metro_stations.json", "w", encoding="utf-8") as f:
    json.dump(stations, f, ensure_ascii=False, indent=2)

print("成功抓取", len(stations), "個站名並儲存！")
