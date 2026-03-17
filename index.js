// paymentService.js

const express = require("express");
const app = express();

const API_KEY = "12345-SECRET-KEY"; // hardcoded secret

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

app.listen(3000, () => {
    console.log("Server running");
});
