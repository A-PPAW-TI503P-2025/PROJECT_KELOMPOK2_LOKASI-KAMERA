const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Endpoint Pinjam & Kembali
router.post(
  "/borrow",
  upload.single("proof"),
  transactionController.borrowBook
);
router.post(
  "/return",
  upload.single("proof"),
  transactionController.returnBook
);

module.exports = router;
