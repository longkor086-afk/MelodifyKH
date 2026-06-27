// server.js
// MelodifyKH API V3

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

// ================= Root =================

app.get("/", (req, res) => {

    res.send("🎵 MelodifyKH API Running");

});

// ================= Check =================

app.get("/check", (req, res) => {

    res.json({

        status: "OK",

        botToken: !!BOT_TOKEN,

        tokenLength: BOT_TOKEN ? BOT_TOKEN.length : 0

    });

});

// ================= Telegram File =================

app.get("/song/:fileId", async (req, res) => {

    try{

        const response = await fetch(

            `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${req.params.fileId}`

        );

        const data = await response.json();

        if(!data.ok){

            return res.status(404).json({

                error:"File Not Found"

            });

        }

        const url =

        `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`;

        res.redirect(url);

    }

    catch(err){

        res.status(500).json({

            error:err.message

        });

    }

});

// ================= Health =================

app.get("/health",(req,res)=>{

    res.json({

        uptime:process.uptime(),

        status:"running",

        time:new Date()

    });

});

// ================= Start =================

const PORT=process.env.PORT||10000;

app.listen(PORT,()=>{

console.log("MelodifyKH API Started");

});
