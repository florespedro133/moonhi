const { Router } = require("express");
const { calculate } = require("../controllers/calculatorController");
const validateInput = require("../middleware/validation");

const router = Router();

/**
 * @swagger
 * tags:
 *  - name: Calculate
 *    description: Endpoints related to calculate arithmetic operations
 */

/**
 * @swagger
 * /api/calculator:
 *   post:
 *     summary: Perform an arithmetic operation
 *     description: Receive two numbers and an operation to calculate the result
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number1
 *               - number2
 *               - operation
 *             properties:
 *               number1:
 *                 type: number
 *                 description: First number
 *               number2:
 *                 type: number
 *                 description: Second number
 *               operation:
 *                 type: string
 *                 enum: ["+", "-", "*", "/"]
 *                 description: Arithmetic operation
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 operation:
 *                   type: string
 *                 inputs:
 *                   type: object
 *                 result:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *       400:
 *         description: Data validation error
 *       500:
 *         description: Server error
 */
router.post("/", validateInput, calculate);

exports = module.exports = router;
