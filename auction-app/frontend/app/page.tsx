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
  situation: string;
  remarks: string;
};

export default function Home() {
  console.log("THIS IS MY PAGE");

  console.log("★★★★★★★★★★★★");
  console.log("THIS IS MY PAGE");
  console.log("★★★★★★★★★★★★");

  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaker, setSelectedMaker] = useState("");


  // CSV 読み込み
 useEffect(() => {
  console.log("FETCH START");

 fetch(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnjK9XVUtz7a5RiTlwBrguEAbqriPm1iu2XMl38UZCFIc8W0eXqPgIpKuN3ZvmuVRpPPyp_58_5cI0/pub?gid=0&single=true&output=csv"
)  
    .then((res) => {
      console.log("FETCH OK", res.status);
      return res.text();
    })
    .then((text) => {
      console.log("CSV LENGTH", text.length);

      Papa.parse<Item>(text, {
        header: true,
        skipEmptyLines: true,
       complete: (results) => {
  console.log("PARSE COMPLETE");

  console.table(results.data.slice(0,20));
console.log("FIRST ITEM", results.data[0]);
console.log("FIRST ITEM KEYS", Object.keys(results.data[0]));
console.log("TYPE OF TITLE", typeof results.data[0].title);
console.log("TYPE OF REMARKS", typeof results.data[0].remarks);
console.log("TYPE OF SITUATION", typeof results.data[0].situation);
  setItems(results.data);
},
      });
    })
    .catch((err) => {
      console.error("FETCH ERROR", err);
    });
}, []);
useEffect(() => {
  console.log("ITEMS", items);
  console.log("ITEMS LENGTH", items.length);
}, [items]);

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

console.log("selectedCategory", selectedCategory);
console.log("selectedSize", selectedSize);
console.log("selectedMaker", selectedMaker);
console.log("filtered count", filteredItems.length);

return (
    <main>
  
  <h1 className="text-3xl font-bold mb-6">
  ＡＳＭ久留米　在庫検索
</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <label className="text-lg font-bold">
  カテゴリ:
          <select
  className="border rounded-lg px-4 py-3 text-lg"
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
>
          
            <option value="">すべて</option>
            {categories.map((c) => (
  <option key={c} value={c}>
    {c === "tire"
      ? "タイヤ"
      : c === "navi"
      ? "ナビ"
      : c === "others"
      ? "その他"
      : c}
  </option>
))}
          
          </select>
        </label>

        <label className="text-lg font-bold">
  サイズ:
          <select
  className="border rounded-lg px-4 py-3 text-lg"
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

        <label className="text-lg font-bold">
  メーカー:
          <select
  className="border rounded-lg px-4 py-3 text-lg"
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

      <p className="mb-4 font-bold">
  該当件数: {filteredItems.length}件
</p>

<div className="grid gap-4">
  {filteredItems.map((item, i) => (
    <div
      key={`${item.category}-${item.store}-${item.title}-${i}`}
      className="border rounded-xl shadow-md p-4 bg-white"
    >
      <h2 className="text-xl font-bold mb-3">
        {item.title}
      </h2>

      <div className="space-y-1 text-sm">
        <p>
          <span className="font-bold">メーカー：</span>
          {item.maker}
        </p>

        {item.size && (
          <p>
            <span className="font-bold">サイズ：</span>
            {item.size}
          </p>
        )}

        <p>
          <span className="font-bold">商品コード：</span>
          {item.code}
        </p>

        <p>
          <span className="font-bold">管理番号：</span>
          {item.store}
        </p>

        {item.category === "tire" && (
          <p>
            <span className="font-bold">製造：</span>
            {item.year}年 / {item.week}週
          </p>
        )}

        <p>
          <span className="font-bold">状態：</span>
          {item.situation}
        </p>

        {item.remarks && (
          <p>
            <span className="font-bold">備考：</span>
            {item.remarks}
          </p>
        )}

        <p>
          <span className="font-bold">在庫：</span>
          {item.amount}
        </p>

        <p className="text-lg font-bold text-black mt-2">
          {item.category === "tire"
            ? "1本価格"
            : item.category === "navi"
            ? "1台価格"
            : item.category === "others"
            ? "1個価格"
            : "価格"}
          ：{item.price ? `${item.price}円` : "価格未設定"}
        </p>
      </div>
    </div>
  ))}
</div>
    </main>
  );
}