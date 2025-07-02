const express = require("express");
const router = express.Router();

const betanoRoute = require("./betanoRoute");
const bet365Route = require("./bet365Route");

router.use("/betano", betanoRoute);
router.use("/bet365", bet365Route);

module.exports = router;
