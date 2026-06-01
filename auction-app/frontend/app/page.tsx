"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

type Item = {
  category: string;
  store: string;
  code: string;
  maker: string;
  title: string;
  size: string;
  week: string;
  year: string;
  amount: string;
  price: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaker, setSelectedMaker] = useState("");

  // CSV 読み込み
  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnjK9XVUtz7a5RiTlwBrguEAbqriPm1iu2XMl38UZCFIc8W0eXqPgIpKuN3ZvmuVRpPPyp_58_5cI0/pub?output=csv"
    )
      .then((res) => res.text())
      .then((text) => {
        Papa.parse<Item>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("parsed first 3 rows:", results.data.slice(0, 3));
            setItems(results.data);
          },
        });
      });
  }, []);

  // カテゴリ候補
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      const v = item.category?.toString().trim();
      if (v) set.add(v);
    });
    const result = Array.from(set);
    console.log("categories options:", result);
    return result;
  }, [items]);

  // サイズ候補
 const sizes = useMemo(() => {
  const set = new Set<string>();

  items
    .filter(
      (item) =>
        !selectedCategory ||
        item.category === selectedCategory
    )
    .forEach((item) => {
      const v = item.size?.toString().trim();
      if (v) set.add(v);
    });

  return Array.from(set);
}, [items, selectedCategory]);

  // メーカー候補
  const makers = useMemo(() => {
  const set = new Set<string>();

  items
    .filter(
      (item) =>
        !selectedCategory ||
        item.category === selectedCategory
    )
    .forEach((item) => {
      const v = item.maker?.toString().trim();
      if (v) set.add(v);
    });

  return Array.from(set);
}, [items, selectedCategory]);

  // 絞り込み
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (selectedSize && item.size !== selectedSize) return false;
      if (selectedMaker && item.maker !== selectedMaker) return false;
      return true;
    });
  }, [items, selectedCategory, selectedSize, selectedMaker]);

  return (
    <main>
      <h1>在庫検索</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <label>
          カテゴリ:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">すべて</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          サイズ:
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">すべて</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          メーカー:
          <select
            value={selectedMaker}
            onChange={(e) => setSelectedMaker(e.target.value)}
          >
            <option value="">すべて</option>
            {makers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p>該当件数: {filteredItems.length}</p>

      <table>
        <thead>
          <tr>
            <th>カテゴリ</th>
            <th>サイズ</th>
            <th>メーカー</th>
            <th>店舗</th>
            <th>コード</th>
            <th>商品名</th>
            <th>週</th>
            <th>年</th>
            <th>在庫数</th>
            <th>価格</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, i) => (
            <tr key={i}>
              <td>{item.category}</td>
              <td>{item.size}</td>
              <td>{item.maker}</td>
              <td>{item.store}</td>
              <td>{item.code}</td>
              <td>{item.title}</td>
              <td>{item.week}</td>
              <td>{item.year}</td>
              <td>{item.amount}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}