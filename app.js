const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");

const routes = require("./src/routes");
const { setupSwagger } = require("./swagger");

const app = express();

// Middleware
app.use(bodyParser.json());

// Router
app.use(/^\/api/i, routes);

setupSwagger(app, process.env.PORT);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 solicitudes por IP
  message: "Too many requests, please try again later.",
});

app.use(limiter);
app.use(xss());

module.exports = app;
