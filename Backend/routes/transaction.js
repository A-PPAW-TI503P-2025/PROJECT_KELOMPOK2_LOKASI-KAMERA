const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const multer = require("multer");
const path = require("path");

// --- PERBAIKAN: KONFIGURASI PENYIMPANAN MULTER ---
// Agar file disimpan dengan ekstensi yang benar (.jpg/.png)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Pastikan folder 'uploads' ada di root backend
    },
    filename: (req, file, cb) => {
        // Membuat nama file unik: timestamp + angka acak + ekstensi asli
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

router.post("/borrow", upload.single("proof"), transactionController.borrowBook);

router.post("/return", upload.single("proof"), transactionController.returnBook);

router.get("/history", transactionController.getAllHistory);

module.exports = router;