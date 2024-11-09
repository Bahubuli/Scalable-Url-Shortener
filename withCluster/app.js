const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const {client} = require("./redisClient");
const dbfun = require("./db/database");

app.use(bodyParser.json());

const urls = {};

app.get("/", (req, res) => {
    res.send(urls);
});


app.post("/shorten", async (req, res) => {
    try {

        const url = req.body.url;

        const id = await client.incr("id");
        await client.sAdd("urls", url);
        await client.hSet("url", id, url);

        res.send({ data: "Created successfully", id });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "An error occurred while shortening the URL.", error });
    }
});

app.get("/redirect", async (req, res) => {
    try {


        const shortUrl = req.query.url;
        const longUrl = await client.hGet("url", shortUrl);

        if (!longUrl || Object.keys(longUrl).length === 0) {
            res.send({ message: "URL not found" });
            return;
        }

        res.send({data:longUrl}); // Redirect to the long URL
    } catch (error) {
        console.error(error);
        res.status(500).send({error:"An error occurred during redirection."});
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("An error occurred");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
