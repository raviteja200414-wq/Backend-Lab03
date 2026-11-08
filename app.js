const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");

let db = null;

const path_=path.join(__dirname,"my_database.db");

const connectDB= async ()=>{
   try{ 
       db = await open({
        filename: path_,
        driver: sqlite3.Database
    });
    console.log("worked"); 
   } catch(e) {
        console.log(`error message: ${e}`);
        process.exit(1);
    }   
};

// 1. GET ALL BOOKS WITH SEARCH, SORTING AND FILTERING
app.get("/books", async (req, res) => {
    try {
        const {
            search_q = "",
            order_by = "bookID",
            order = "ASC",
            limit = "10",
            offset = "0",
            min_rating,
            max_rating
        } = req.query;

        // Validate sorting column using the new schema
        const allowedColumns = [
            "bookID", "title", "authors", "average_rating", "num_pages"
        ];

        if (!allowedColumns.includes(order_by)) {
            return res.status(400).json({
                message: "Invalid order_by column"
            });
        }

        const sortOrder = order.toUpperCase();
        if (!["ASC", "DESC"].includes(sortOrder)) {
            return res.status(400).json({
                message: "Order must be ASC or DESC"
            });
        }

        const pageLimit = Number(limit);
        const pageOffset = Number(offset);

        if (
            !Number.isInteger(pageLimit) ||
            pageLimit < 1 ||
            !Number.isInteger(pageOffset) ||
            pageOffset < 0
        ) {
            return res.status(400).json({
                message: "Invalid limit or offset"
            });
        }

        let conditions = [];
        let params = [];

        if (search_q.trim() !== "") {
            conditions.push("title LIKE ?");
            params.push(`%${search_q}%`);
        }

        // Swapped price filters for average_rating based on the new schema
        if (min_rating !== undefined) {
            const min = Number(min_rating);
            if (!Number.isFinite(min)) {
                return res.status(400).json({
                    message: "min_rating must be numeric"
                });
            }
            conditions.push("average_rating >= ?");
            params.push(min);
        }

        if (max_rating !== undefined) {
            const max = Number(max_rating);
            if (!Number.isFinite(max)) {
                return res.status(400).json({
                    message: "max_rating must be numeric"
                });
            }
            conditions.push("average_rating <= ?");
            params.push(max);
        }

        if (
            min_rating !== undefined &&
            max_rating !== undefined &&
            Number(min_rating) > Number(max_rating)
        ) {
            return res.status(400).json({
                message: "min_rating cannot exceed max_rating"
            });
        }

        let sql = "SELECT * FROM my_table";

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += ` ORDER BY ${order_by} ${sortOrder}`;
        sql += " LIMIT ? OFFSET ?";
        params.push(pageLimit, pageOffset);

        const books = await db.all(sql, params);
        res.status(200).json(books);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


// 2. GET A SINGLE BOOK
app.get("/books/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        const book = await db.get(
            "SELECT * FROM my_table WHERE bookID = ?",
            [id]
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


// 3. CREATE A BOOK
app.post("/books", async (req, res) => {
    try {
        const { bookID,title, authors, average_rating, num_pages } = req.body;

        if (
            typeof title !== "string" ||
            title.trim() === "" ||
            typeof authors !== "string" ||
            authors.trim() === "" ||
            average_rating === undefined ||
            average_rating === null ||
            average_rating === "" ||
            !Number.isFinite(Number(average_rating))
        ) {
            return res.status(400).json({
                message: "Title, authors, and a numeric average_rating are required"
            });
        }

        const result = await db.run(
            `INSERT INTO my_table (bookID,title, authors, average_rating, num_pages)
             VALUES (?,?, ?, ?, ?)`,
            [   Number(bookID),
                title.trim(),
                authors.trim(),
                Number(average_rating),
                num_pages ?? null
            ]
        );

        res.status(201).json({
            message: "Book created successfully",
            bookID: `${bookID}`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


// 4. UPDATE A BOOK
app.put("/books/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        const { title, authors, average_rating, num_pages } = req.body;

        if (
            typeof title !== "string" ||
            title.trim() === "" ||
            typeof authors !== "string" ||
            authors.trim() === "" ||
            average_rating === undefined ||
            average_rating === null ||
            average_rating === "" ||
            !Number.isFinite(Number(average_rating))
        ) {
            return res.status(400).json({
                message: "Title, authors, and a numeric average_rating are required"
            });
        }

        const result = await db.run(
            `UPDATE my_table
             SET title = ?, authors = ?, average_rating = ?, num_pages = ?
             WHERE bookID = ?`,
            [
                title.trim(),
                authors.trim(),
                Number(average_rating),
                num_pages ?? null,
                id
            ]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book updated successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


// 5. DELETE A BOOK
app.delete("/books/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        const result = await db.run(
            "DELETE FROM my_table WHERE bookID = ?",
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// Start server only after database connection
async function startServer() {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

startServer();