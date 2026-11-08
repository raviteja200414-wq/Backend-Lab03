const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("my_database.db");

db.run('ALTER TABLE my_table RENAME COLUMN "  num_pages" TO num_pages', (err) => {
    if (err) {
        console.error("Error:", err.message);
    } else {
        console.log("Column renamed successfully!");
    }
});