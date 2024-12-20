const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Arithmetic API",
      version: "1.0.0",
      description: "API to arithmetic operations",
    },
  },
  apis: ["./src/routes/*.js"], // Documenta solo los archivos en esta ruta
};

const swaggerDocs = swaggerJsDoc(swaggerDefinition);

const setupSwagger = (app, port) => {
  const url =
    process.env.NODE_ENV === "production"
      ? `https://localhost:${port}/api/docs`
      : `http://localhost:${port}/api/docs`;
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use("/api/docs.json", (_, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
  });
  console.log(`Swagger Docs running on ${url}`);
};

module.exports = { setupSwagger };
