"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// データ管理用の変数（本来はDBだが、今回は変数に記録）
let ramenList = [
    { id: 1, shop: "Hi-Fat Noodle BUTCHER’S", product: "二郎インスパイアラーメン", price: 900, rating: 5, comment: "乳化スープと小麦感のある麺が最高" },
    { id: 2, shop: "燈郎", product: "二郎系ラーメン？", price: 950, rating: 4, comment: "野菜たっぷりで食べ応えあり。ステーキも素敵" },
    { id: 3, shop: "麺屋 一燈", product: "濃厚魚介つけ麺", price: 1200, rating: 4.5, comment: "つけ麺食べるならここ一択。でも高め" },
    { id: 4, shop: "元祖油堂", product: "油そば", price: 880, rating: 4, comment: "飲み放題の烏龍茶とベストマッチ。最初の一口でクライマックス" },
    { id: 5, shop: "中華そば専門 邦ちゃん", product: "中華そば", price: 790, rating: 4, comment: "安く腹一杯になりたいならここ。値段のくせにチャーシュー多め。ついでにお米食べ放題" },
];
// 一覧表示
app.get("/ramen", (req, res) => {
    res.render("ramen_list", { data: ramenList });
});


//詳細表示
app.get("/ramen/:id", (req, res) => {
    const item = ramenList.find(r => r.id === parseInt(req.params.id));
    if (item) {
        res.render("ramen_details", { item: item });
    } else {
        res.status(404).send("データが見つかりません");
    }
});

//追加//
app.post("/ramen/add", (req, res) => {
    const newItem = {
        id: ramenList.length > 0 ? Math.max(...ramenList.map(r => r.id)) + 1 : 1,
        shop: req.body.shop,
        product: req.body.product,
        price: parseInt(req.body.price) || 0,
        rating: parseInt(req.body.rating) || 3,
        comment: req.body.comment
    };
    ramenList.push(newItem);
    res.redirect("/ramen");
});

//編集//
app.get("/ramen/edit/:id", (req, res) => {
    const item = ramenList.find(r => r.id === parseInt(req.params.id));
    if (item) {
        res.render("ramen_edit", { item: item });
    } else {
        res.status(404).send("データが見つかりません");
    }
});

//更新処理//
app.post("/ramen/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = ramenList.findIndex(r => r.id === id);
    if (index !== -1) {
        ramenList[index] = {
            id: id,
            shop: req.body.shop,
            product: req.body.product,
            price: parseInt(req.body.price) || 0,
            rating: parseInt(req.body.rating) || 0,
            comment: req.body.comment
        };
    }
    res.redirect("/ramen");
});

//削除//
app.get("/ramen/delete/:id", (req, res) => {
    ramenList = ramenList.filter(r => r.id !== parseInt(req.params.id));
    res.redirect("/ramen");
});

app.listen(8080, () => console.log("Server running on http://localhost:8080"));