const db = require("./database.js");

const runQueries = async () => {
    try {
        // Await the database instance
        const database = await db;

        // Insert URL into the database
        await database.run("INSERT INTO urls(url) VALUES(?)", ["https://www.google.com"]);

        // Query all URLs from the database
        const res = await database.all("SELECT * FROM urls");
        console.log(res); // Log the results of the SELECT query

    } catch (err) {
        console.error("Error occurred:", err);
    }
};

runQueries(); // Execute the function
