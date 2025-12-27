"use strict";
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// データ管理用の変数（初期データ）
let maamList = [
    { id: 1, name: "2007年", count: 16, weight: 294, price: 300, comment: "果たして多いのか微妙" },
    { id: 2, name: "2008年", count: 16, weight: 252, price: 300, comment: "1年前と比べて露骨に減った" },
    { id: 3, name: "2011年", count: 16, weight: 231, price: 300, comment: "2010年に大きさが5cmになったらしい" },
    { id: 4, name: "2014年", count: 16, weight: 210, price: 300, comment: "5年で50g近く減ってる" },
    { id: 5, name: "2016年", count: 16, weight: 200, price: 300, comment: "2006年と比べて2/3に..." },
    { id: 6, name: "2022年", count: 16, weight: 190, price: 300, comment: "ここで直径が4cmに" },
    { id: 7, name: "2024年", count: 14, weight: 180, price: 330, comment: "価格が上がり内容量が少し増えた" },
    { id: 8, name: "2025年現在", count: 12, weight: 180, price: 330, comment: "内容量が2枚減らされました" }
];

// 一覧表示
app.get("/maam", (req, res) => {
    res.render("maam_list", { data: maamList });
});

// 詳細表示
app.get("/maam/:id", (req, res) => {
    const item = maamList.find(m => m.id === parseInt(req.params.id));
    if (item) {
        res.render("maam_details", { item: item });
    } else {
        res.status(404).send("データが見つかりません");
    }
});

// 追加処理
app.post("/maam/add", (req, res) => {
    const newItem = {
        id: maamList.length > 0 ? Math.max(...maamList.map(m => m.id)) + 1 : 1,
        name: req.body.name,
        count: parseInt(req.body.count) || 0,
        weight: parseInt(req.body.weight) || 0,
        price: parseInt(req.body.price) || 0,
        comment: req.body.comment
    };
    maamList.push(newItem);
    res.redirect("/maam");
});

// 編集画面表示
app.get("/maam/edit/:id", (req, res) => {
    const item = maamList.find(m => m.id === parseInt(req.params.id));
    if (item) {
        res.render("maam_edit", { item: item });
    } else {
        res.status(404).send("データが見つかりません");
    }
});

// 更新処理
app.post("/maam/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = maamList.findIndex(m => m.id === id);
    if (index !== -1) {
        maamList[index] = {
            id: id,
            name: req.body.name,
            count: parseInt(req.body.count) || 0,
            weight: parseInt(req.body.weight) || 0,
            price: parseInt(req.body.price) || 0,
            comment: req.body.comment
        };
    }
    res.redirect("/maam");
});

// 削除処理
app.get("/maam/delete/:id", (req, res) => {
    maamList = maamList.filter(m => m.id !== parseInt(req.params.id));
    res.redirect("/maam");
});

app.listen(8080, () => console.log("Server running on http://localhost:8080/maam"));