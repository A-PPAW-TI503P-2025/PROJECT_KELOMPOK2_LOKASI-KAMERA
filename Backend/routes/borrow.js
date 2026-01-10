const express = require("express");
const router = express.Router();
const controller = require("../controllers/borrowController");

router.post("/pinjam", controller.pinjamBuku);
router.post("/kembalikan", controller.kembalikanBuku);

module.exports = router;
