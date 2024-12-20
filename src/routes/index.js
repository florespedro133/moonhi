const { Router } = require("express");

const CalculatorRouter = require("./calculator");

const router = Router();

router.use("/calculator", CalculatorRouter);

module.exports = router;