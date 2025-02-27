const request = require("supertest");
const app = require("../app"); 
const sequelize = require("../database/database"); // Import Sequelize instance

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset test database before tests
});

afterAll(async () => {
  await sequelize.close(); // Close the DB connection after all tests
});

describe("App", () => {
  test("GET unknown path - It should respond with 404 and error message", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Path Not Found");
  });

  test('Error handling - It should respond with 404 and "Path Not Found"', async () => {
    app.get("/error-test", (req, res, next) => {
      next(new Error("Something went wrong"));
    });

    const response = await request(app).get("/error-test");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Path Not Found");
  });

  // Add more tests for other routes and scenarios as needed
});
