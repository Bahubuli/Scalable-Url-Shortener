const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const dbName = "test.db";

// Initialize the database connection
const db = sqlite.open({
    filename: dbName,
    driver: sqlite3.Database
}).then(async (database) => {
    console.log("Database connected successfully");

    // Create the table if it doesn't exist
    await database.run("CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT)");
    console.log("Table created successfully");

    return database; // Return the db instance
});

// Export the database promise directly
module.exports = db;
