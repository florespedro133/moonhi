const crypto = require("crypto");

const Log = require("../models/logModel");
const { setCache, getCache } = require("../services/redisService");

const performOperation = (number1, number2, operation) => {
  switch (operation) {
    case "+":
      return number1 + number2;
    case "-":
      return number1 - number2;
    case "*":
      return number1 * number2;
    case "/":
      if (number2 === 0) throw new Error("Division by zero");
      return number1 / number2;
    default:
      throw new Error("Invalid operation");
  }
};

function obfuscateData(data) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.CIPHER_KEY,
    process.env.CIPHER_IV
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

const calculate = async (req, res) => {
  const startTime = Date.now();
  const { number1, number2, operation } = req.body;
  const cacheKey = `${number1}${operation}${number2}`;

  try {
    // Buscar en el cache
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.json({
        status: "success",
        operation,
        inputs: { number1, number2 },
        result: cachedResult,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      });
    }

    // Calcular el resultado
    const result = performOperation(number1, number2, operation);
   // result = obfuscateData(result.toString());

    // Guardar en Redis
    await setCache(cacheKey, result, 60);

    // Log en MongoDB
    const log = new Log({
      operation,
      inputs: { number1, number2 },
      result,
      timestamp: new Date(),
      responseTime: Date.now() - startTime,
    });
    await log.save();

    res.json({
      status: "success",
      operation,
      inputs: { number1, number2 },
      result,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = { calculate };
