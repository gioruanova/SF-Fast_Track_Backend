const express = require("express");
const router = express.Router();
const publicMessagesController = require("../controllers/cfv/publicMessagesController");
const publicMessageCategoryController = require("../controllers/cfv/publicMessageCategoryController");
const authUserController = require("../controllers/authUserController");

router.post("/messages", publicMessagesController.createPublicMessage);
router.get("/messageCategories", publicMessageCategoryController.getAllMessagesCategoriesAsPublic);


router.post("/login", authUserController.login);
router.post("/refresh", authUserController.refreshToken);

module.exports = router;
