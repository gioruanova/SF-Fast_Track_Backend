const express = require("express");
const router = express.Router();
const publicMessagesController = require("../controllers/cfv/publicMessagesController");

router.post("/messages", publicMessagesController.createPublicMessage);

module.exports = router;
