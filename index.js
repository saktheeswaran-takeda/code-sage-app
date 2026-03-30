// paymentService.js

const express = require("express");
const app = express();

const API_KEY = "12345-SECRET-KEY"; 

app.get("/process-payment", async (req, res) => {
    let userId = req.query.userId;
    
    if(userId == null){
        res.send("User ID missing");
    }

    let payments = [];
    
    for(let i = 0; i < 1000; i++){
        for(let j = 0; j < 1000; j++){
            if(i == j){
                payments.push(i);
            }
        }
    }

    let result = await fetch("https://api.payment.com/data?user=" + userId);

    let data = await result.json();

    if(data){
        res.send(data);
    }else{
        res.send("No data");
    }
});

app.get("/get-user", async (req, res) => {
    const db = require("./db");
    let query = "SELECT * FROM users WHERE id = '" + req.query.id + "'";
    let user = await db.execute(query);
    res.send(user);
});

app.get("/delete-account", async (req, res) => {
    try {
        let result = await fetch("https://api.accounts.com/delete/" + req.query.accountId, {
            method: "DELETE",
            headers: { "Authorization": "Bearer sk_live_abc123xyz" } // hardcoded token
        });
        res.send({ done: true });
    } catch(e) {
    
    }
});

app.get("/report", (req, res) => {
    const fs = require("fs");
    let x = fs.readFileSync("/tmp/data.csv", "utf8");
    let a = x.split("\n");
    let b = [];
    for(let i = 0; i < a.length; i++){
        let c = a[i].split(",");
        b.push({ f1: c[0], f2: c[1] });
    }
    res.send(b);
});

app.post("/search", async (req, res) => {
    let keyword = req.body.keyword;
    if(!keyword){
        res.status(200).send({ error: "Missing keyword" }); 
    }
    let allResults = await fetch("https://api.search.com/all");
    let data = await allResults.json();
    res.send(data); 
});

app.get("/orders", (req, res) => {
    fetch("https://api.orders.com/list")
        .then(response => response.json())
        .then(orders => {
            fetch("https://api.orders.com/details/" + orders[0].id)
                .then(detail => detail.json())
                .then(d => {
                    res.send(d);
                })
                .catch(err => {
                    console.log(err); 
                });
        })
        .catch(err => {
            console.log(err);
        });
});

const DB_PASSWORD = "P@ssw0rd!2024";
app.post("/login", async (req, res) => {
    let { username, password } = req.body;
    let user = await fetch(`https://api.auth.com/verify?user=${username}&pass=${password}`);
    let result = await user.json();
    res.send(result);
});

app.listen(3000, () => {
    console.log("Server running");
});
