"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [makerSearch, setMakerSearch] = useState("");
const [sizeSearch, setSizeSearch] = useState("");

 useEffect(() => {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRnjK9XVUtz7a5RiTlwBrguEAbqriPm1iu2XMl38UZCFIc8W0eXqPgIpKuN3ZvmuVRpPPyp_58_5cI0/pub?output=csv")
    .then((res) => res.text())
    .then((text) => {

      const lines = text.trim().split("\n");

      const headers = lines[0].trim().split(",");

      const data = lines.slice(1).map((line, index) => {
        const cols = line.trim().split(",");

        const row: any = {};

        headers.forEach((header, i) => {
          row[header.trim()] = cols[i];
        });

        return {
        id: index,
        store: row["store"],
        code: row["code"],
        maker: row["maker"],
        title: row["title"],
        size: row["size"],
        week: row["week"],
        year: row["year"],
        amount: row["amount"],
        price: row["price"]?.replace("\r", "").trim() || "",
    };
    });

      console.log(data);

      setItems(data);
    });
}, []);


  const filteredItems = items.filter((item) => {
  const freeWord =
    `${item.title} ${item.code}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const makerMatch =
    item.maker
      ?.toLowerCase()
      .includes(makerSearch.toLowerCase());

  const sizeMatch =
    item.size
      ?.toLowerCase()
      .includes(sizeSearch.toLowerCase());

  return freeWord && makerMatch && sizeMatch;
});


  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        商品検索システム
      </h1>

      <input
  type="text"
  placeholder="検索..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-3 rounded w-full max-w-xl mb-4"
/>

<input
  type="text"
  placeholder="メーカー検索"
  value={makerSearch}
  onChange={(e) => setMakerSearch(e.target.value)}
  className="border p-3 rounded w-full max-w-xl mb-4"
/>

<input
  type="text"
  placeholder="サイズ検索"
  value={sizeSearch}
  onChange={(e) => setSizeSearch(e.target.value)}
  className="border p-3 rounded w-full max-w-xl mb-6"
/>
       <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded shadow"
          >
            <h2 className="text-xl font-bold">
              {item.title}
            </h2>

            <p>商品コード: {item.code}</p>

            <p>メーカー: {item.maker}</p>

            <p>サイズ: {item.size}</p>

            <p>店舗: {item.store}</p>

            <p>
              {item.year}年 / {item.week}週
            </p>

            <p>本数: {item.amount}</p>
           
            <p>価格: {item.price || "未設定"}</p>

          </div>
        ))}
      </div>
    </main>
  );
}
