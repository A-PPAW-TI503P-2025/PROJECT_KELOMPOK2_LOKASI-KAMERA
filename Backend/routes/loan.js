const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

router.post("/borrow", loanController.borrow);

module.exports = router;
