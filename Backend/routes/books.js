const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.getAll);
router.post("/", bookController.add);

router.put("/:id", bookController.updateBook);    // Untuk Edit
router.delete("/:id", bookController.deleteBook); // Untuk Hapus

module.exports = router;