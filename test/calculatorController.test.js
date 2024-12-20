const request = require("supertest");
const app = require("../app"); // Aquí debes importar tu app Express
const { setCache, getCache } = require("../src/services/redisService"); // Importa los servicios si los usas en el controlador
const Log = require("../src/models/logModel"); // Importa el modelo de Log para los tests si es necesario

// Mock de los servicios de Redis y Log para evitar accesos a la base de datos real durante las pruebas
jest.mock("../src/services/redisService");
jest.mock("../src/models/logModel");

describe("Calculator Controller", () => {
  // Test para operaciones exitosas
  describe("POST /calculate", () => {
    it("should return correct result for addition", async () => {
      const response = await request(app)
        .post("/api/calculator")
        .send({ number1: 3, number2: 2, operation: "+" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.result).toBe(5);
    });

    it("should return correct result for division", async () => {
      const response = await request(app)
        .post("/api/calculator")
        .send({ number1: 6, number2: 2, operation: "/" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.result).toBe(3);
    });
  });

  // Test para el caso de división por cero
  it("should handle division by zero", async () => {
    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: 6, number2: 0, operation: "/" });

    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Division by zero");
  });

  // Test para la validación de operación inválida
  it("should return an error for an invalid operation", async () => {
    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: 3, number2: 2, operation: "%" });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe(
      '"operation" must be one of [+, -, *, /]'
    );
  });

  // Test para la validación de números no numéricos
  it("should return an error for invalid numbers", async () => {
    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: "a", number2: 2, operation: "+" });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe('"number1" must be a number');
  });

  // Test para verificar si la cache se usa correctamente
  it("should return cached result", async () => {
    // Simula que hay un resultado cacheado
    getCache.mockResolvedValueOnce(5);

    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: 3, number2: 2, operation: "+" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.result).toBe(5);
  });

  // Test para logueo de la operación en MongoDB
  it("should log the operation in MongoDB", async () => {
    Log.mockImplementationOnce(() => ({
      save: jest.fn().mockResolvedValue(true),
    }));

    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: 3, number2: 2, operation: "+" });

    expect(Log).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });
});
