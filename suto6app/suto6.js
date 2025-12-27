"use strict";
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// 初期データ
let moveList = [
    { id: 1, name: "立ち弱P", startup: 4, duration: "4〜6", stiffness: 7, hit: 5, block: -2, damage: 300, comment: "ここから弱Kに繋げよう" },
    { id: 2, name: "立ち弱K", startup: 5, duration: "5〜7", stiffness: 10, hit: 2, block: -3, damage: 300, comment: "ヒット確認からアローに繋げよう" },
    { id: 3, name: "立ち中P", startup: 6, duration: "6〜9", stiffness: 13, hit: 6, block: -1, damage: 600, comment: "カウンター確認から立ち大Pに繋げよう" },
    { id: 4, name: "立ち中K", startup: 8, duration: "8〜10", stiffness: 18, hit: 3, block: -4, damage: 700, comment: "牽制技" },
    { id: 5, name: "立ち強P", startup: 8, duration: "8〜10", stiffness: 20, hit: 2, block: -3, damage: 800, comment: "振りすぎ注意" },
    { id: 6, name: "立ち強K", startup: 11, duration: "11〜13", stiffness: 21, hit: 2, block: -3, damage: 900, comment: "差し返し技" },
    { id: 7, name: "しゃがみ弱P", startup: 4, duration: "4〜5", stiffness: 8, hit: 5, block: -2, damage: 300, comment: "特になし" },
    { id: 8, name: "しゃがみ弱K", startup: 5, duration: "5〜7", stiffness: 7, hit: 3, block: -2, damage: 200, comment: "特になし" },
    { id: 9, name: "しゃがみ中P", startup: 7, duration: "7〜9", stiffness: 14, hit: 5, block: -2, damage: 600, comment: "差し返し技かつキャンセル可能" },
    { id: 10, name: "しゃがみ中K", startup: 8, duration: "8〜10", stiffness: 18, hit: 1, block: -5, damage: 500, comment: "キャミィの攻めの要" },
    { id: 11, name: "しゃがみ強P", startup: 10, duration: "10〜13", stiffness: 15, hit: 7, block: 1, damage: 700, comment: "パニカン時はODフーリガンにつながる" },
    { id: 12, name: "しゃがみ強K", startup: 9, duration: "9〜11", stiffness: 24, hit: "ダウン", block: -10, damage: 900, comment: "差し返し技" },
    { id: 13, name: "ジャンプ弱P", startup: 4, duration: "4〜13", stiffness: 3, hit: 0, block: 0, damage: 300, comment: "後ろジャンプ弱PorKで対空" },
    { id: 14, name: "ジャンプ弱K", startup: 4, duration: "4〜13", stiffness: 3, hit: 0, block: 0, damage: 500, comment: "後ろジャンプ弱PorKで対空" },
    { id: 15, name: "ジャンプ中P", startup: 6, duration: "6〜13", stiffness: 3, hit: 0, block: 0, damage: 600, comment: "特になし" },
    { id: 16, name: "ジャンプ中K", startup: 7, duration: "7〜12", stiffness: 3, hit: 0, block: 0, damage: 600, comment: "特になし" },
    { id: 17, name: "ジャンプ強P", startup: 8, duration: "8〜12", stiffness: 3, hit: 0, block: 0, damage: 800, comment: "ヒット後の展開は素早く" },
    { id: 18, name: "ジャンプ強K", startup: 10, duration: "10〜15", stiffness: 3, hit: 0, block: 0, damage: 800, comment: "個人的に最強だと思います" },
    { id: 19, name: "引き中P", startup: 5, duration: "5〜9", stiffness: 12, hit: 4, block: -1, damage: 500, comment: "生ラッシュ連携で最強" },
    { id: 20, name: "前大K", startup: 18, duration: "18〜20", stiffness: 25, hit: "ダウン", block: -12, damage: 800, comment: "使わないほうがいい" },
    { id: 21, name: "引き大K", startup: 9, duration: "9〜11", stiffness: 18, hit: "ダウン", block: -7, damage: 800, comment: "コンボ以外で対空に少し使える" },
    { id: 22, name: "リフトコンビネーション", startup: 9, duration: "9〜11", stiffness: 23, hit: "ダウン", block: -12, damage: 600, comment: "SA2が最速で確定" },
    { id: 23, name: "スイングコンビネーション", startup: 13, duration: "13〜31", stiffness: 29, hit: "ダウン", block: -12, damage: 800, comment: "打ち切ってインパクトするのも戦略" },
    { id: 24, name: "弱スパイラルアロー", startup: 9, duration: "9〜21", stiffness: 21, hit: "ダウン", block: -12, damage: 800, comment: "牽制技として使える" },
    { id: 25, name: "中スパイラルアロー", startup: 9, duration: "9〜23", stiffness: 21, hit: "ダウン", block: -14, damage: 900, comment: "牽制技として使える。でも弱でいい" },
    { id: 26, name: "強スパイラルアロー", startup: 15, duration: "15〜30", stiffness: 21, hit: "ダウン", block: -12, damage: 1000, comment: "しゃがみ中Pから確認できたらえらい" },
    { id: 27, name: "強スパイラルアロー（ホールド）", startup: 27, duration: "27〜42", stiffness: 20, hit: "ダウン", block: -14, damage: 1000, comment: "SA1or3が入る" },
    { id: 28, name: "ODスパイラルアロー", startup: 13, duration: "13〜28", stiffness: 20, hit: "ダウン", block: -14, damage: 800, comment: "SA1or3が入る" },
    { id: 29, name: "弱キャノンスパイク", startup: 5, duration: "5〜16", stiffness: 16, hit: "ダウン", block: -36, damage: 900, comment: "対空技" },
    { id: 30, name: "中キャノンスパイク", startup: 6, duration: "6〜17", stiffness: 16, hit: "ダウン", block: -36, damage: 1000, comment: "対空技" },
    { id: 31, name: "強キャノンスパイク", startup: 7, duration: "7〜18", stiffness: 16, hit: "ダウン", block: -40, damage: 1200, comment: "対空技。たまにすっぽ抜ける" },
    { id: 32, name: "ODキャノンスパイク", startup: 6, duration: "6〜17", stiffness: 16, hit: "ダウン", block: -40, damage: 1500, comment: "無敵の暴れ技。攻められたらこれ" },
    { id: 31, name: "弱アクセルスピンナックル", startup: 21, duration: "21〜24", stiffness: 16, hit: 2, block: -3, damage: 800, comment: "コンボ技" },
    { id: 32, name: "中アクセルスピンナックル", startup: 24, duration: "24〜27", stiffness: 16, hit: 3, block: -2, damage: 800, comment: "ほぼ使わん" },
    { id: 33, name: "強アクセルスピンナックル", startup: 28, duration: "28〜31", stiffness: 17, hit: 5, block: 3, damage: 800, comment: "玉抜け技。結構当たってくれる" },
    { id: 34, name: "ODアクセルスピンナックル", startup: 25, duration: "25〜28", stiffness: 17, hit: 7, block: -2, damage: 800, comment: "密着で打つと表裏で鬼強い" },
    { id: 35, name: "キャノンストライク", startup: 13, duration: "13〜23", stiffness: 12, hit: 0, block: -6, damage: 600, comment: "キャミィの要。これだけは覚えろ" },
    { id: 36, name: "ODキャノンストライク", startup: 13, duration: "13〜22", stiffness: 12, hit: 0, block: -3, damage: 800, comment: "ここからSA1or3に繋がる" },
    { id: 37, name: "スピンドライブスマッシャー", startup: 9, duration: "9〜19", stiffness: 38, hit: "ダウン", block: -24, damage: 2000, comment: "運びが強い。結構な頻度で使用する" },
    { id: 38, name: "キラービースピン", startup: 13, duration: "13〜21", stiffness: 37, hit: "ダウン", block: -24, damage: 3000, comment: "使い方が結構むずい" },
    { id: 39, name: "デルタレッドアサルト", startup: 9, duration: "9〜23", stiffness: 34, hit: "ダウン", block: -33, damage: 4000, comment: "CAで500ダメージ追加" },
];

// 一覧表示
app.get("/cammy", (req, res) => {
    res.render("suto6_list", { data: moveList });
});

// 詳細表示
app.get("/cammy/:id", (req, res) => {
    const item = moveList.find(m => m.id === parseInt(req.params.id));
    if (item) {
        res.render("suto6_details", { item: item });
    } else {
        res.status(404).send("データが見つかりません");
    }
});

// 追加処理
app.post("/cammy/add", (req, res) => {
    const newItem = {
        id: moveList.length > 0 ? Math.max(...moveList.map(m => m.id)) + 1 : 1,
        name: req.body.name,
        startup: parseInt(req.body.startup) || 0,
        duration: req.body.duration,
        stiffness: parseInt(req.body.stiffness) || 0,
        hit: isNaN(req.body.hit) ? req.body.hit : parseInt(req.body.hit),
        block: parseInt(req.body.block) || 0,
        damage: parseInt(req.body.damage) || 0,
        comment: req.body.comment
    };
    moveList.push(newItem);
    res.redirect("/cammy");
});

// 編集画面表示
app.get("/cammy/edit/:id", (req, res) => {
    const item = moveList.find(m => m.id === parseInt(req.params.id));
    if (item) {
        res.render("suto6_edit", { item: item });
    } else {
        res.status(404).send("データが見つかりません");
    }
});

// 更新処理
app.post("/cammy/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = moveList.findIndex(m => m.id === id);
    if (index !== -1) {
        moveList[index] = {
            id: id,
            name: req.body.name,
            startup: parseInt(req.body.startup) || 0,
            duration: req.body.duration,
            stiffness: parseInt(req.body.stiffness) || 0,
            hit: isNaN(req.body.hit) ? req.body.hit : parseInt(req.body.hit),
            block: parseInt(req.body.block) || 0,
            damage: parseInt(req.body.damage) || 0,
            comment: req.body.comment
        };
    }
    res.redirect("/cammy");
});

// 削除処理
app.get("/cammy/delete/:id", (req, res) => {
    moveList = moveList.filter(m => m.id !== parseInt(req.params.id));
    res.redirect("/cammy");
});

app.listen(8080, () => console.log("Running on http://localhost:8080/cammy"));