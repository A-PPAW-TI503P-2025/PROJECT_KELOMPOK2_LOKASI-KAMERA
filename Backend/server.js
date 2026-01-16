const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// Middleware parsing body
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Agar folder uploads bisa diakses (buat lihat bukti foto)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/books", require("./routes/books"));
app.use("/transaction", require("./routes/transaction")); // Pakai yang baru

// Jalankan Server
app.listen(3000, () => {
  console.log(`🚀 Server running at: http://localhost:3000`);
});