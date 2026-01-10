const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.getAll);
router.post("/", bookController.add);

module.exports = router;
