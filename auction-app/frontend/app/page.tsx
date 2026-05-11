"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [makerSearch, setMakerSearch] = useState("");
const [sizeSearch, setSizeSearch] = useState("");

  useEffect(() => {
    fetch("/items.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n");

        const data = lines.slice(1).map((line, index) => {
          const cols = line.split(",");

          return {
            id: index,
            store: cols[0],
            code: cols[1],
            maker: cols[2],
            title: cols[3],
            size: cols[4],
            week: cols[5],
            year: cols[6],
            amount: cols[7],
          };
        });

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
          </div>
        ))}
      </div>
    </main>
  );
}
