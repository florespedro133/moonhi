const request = require("supertest");
const app = require("../app");
const { setCache, getCache } = require("../src/services/redisService");
const Log = require("../src/models/logModel");

jest.mock("../src/services/redisService");
jest.mock("../src/models/logModel");

describe("Calculator Controller", () => {
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

  it("should handle division by zero", async () => {
    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: 6, number2: 0, operation: "/" });

    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe("Division by zero");
  });

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

  it("should return an error for invalid numbers", async () => {
    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: "a", number2: 2, operation: "+" });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBe('"number1" must be a number');
  });


  it("should return cached result", async () => {
    getCache.mockResolvedValueOnce(5);

    const response = await request(app)
      .post("/api/calculator")
      .send({ number1: 3, number2: 2, operation: "+" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.result).toBe(5);
  });

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

afterEach(() => {
  jest.clearAllMocks();
});
