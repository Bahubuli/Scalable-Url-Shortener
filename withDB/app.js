const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const dbfun = require("./db/database");

app.use(bodyParser.json());

const urls = {};

app.get("/", (req, res) => {
    res.send(urls);
});

// we will use same connection for all requests
let db = null;

app.post("/shorten", async (req, res) => {
    try {
        // Check if the database instance is already created
        // If not, create a new instance
        if(!db)
            db = await dbfun;

        const url = req.body.url;
        console.log("URL to shorten:", url);

        // Check if the URL already exists in the database
        const exists = await db.get("SELECT url FROM urls WHERE url = ?", [url]);

        if (exists) {
            res.send({ data: "URL already exists", exists });
            return;
        }

        // Insert the new URL into the database
        const resp = await db.run("INSERT INTO urls(url) VALUES(?)", [url]);
        res.send({ data: "Created successfully", resp });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "An error occurred while shortening the URL.", error });
    }
});

app.get("/redirect", async (req, res) => {
    try {
        if(!db)
            db = await dbfun;

        const shortUrl = req.query.url;
        const longUrl = await db.get("SELECT url FROM urls WHERE id = ?", [shortUrl]);

        if (!longUrl) {
            res.send({ message: "URL not found" });
            return;
        }

        //res.redirect(longUrl.url); // to actually redirect
        res.send({data:longUrl.url}); // Redirect to the long URL
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
