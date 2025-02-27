const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User"); // Sequelize User model
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
let token = "";
let userId;

beforeAll(async () => {
  await User.destroy({ where: {} }); // Clear the users table

  const res = await api.post("/users/register").send({
    username: "testUser",
    password: "test123",
    fullname: "Test User",
    email: "test2@gmail.com",
  });

  const loginRes = await api.post("/users/login").send({
    username: "testUser",
    password: "test123",
  });

  token = loginRes.body.token;
  payload=jwt.verify(token, process.env.SECRET);
  userId = payload.id
  await User.update({ role: "admin" }, { where: { username: "testUser" } });
});

test("Logged in user can get their profile", async () => {
  await api
    .get("/users/")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.data[0].username).toBe("testUser");
      expect(res.body.data[0].fullname).toBe("Test User");
    });
});

test("Logged in user can update their profile", async () => {
  await api
    .put("/users/edit-profile")
    .set("Authorization", `Bearer ${token}`)
    .send({
      username: "updatedUser",
      fullname: "Updated User",
    })
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.data[0].username).toBe("updatedUser");
      expect(res.body.data[0].fullname).toBe("Updated User");
    });
});


test("User cannot register with an existing username and email", async () => {
  await api
    .post("/users/register")
    .send({
      username: "testUser",
      password: "newpassword123",
      fullname: "New User",
      email: "test2@gmail.com",
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Duplicate username or email");
    });
});

test("User cannot register with an invalid email", async () => {
  await api
    .post("/users/register")
    .send({
      username: "newUser",
      password: "newpassword123",
      fullname: "New User",
      email: "invalidemail",
    })
    .expect(400)
    .then((res) => {
      expect(res.body.error).toBe("Please enter a valid email");
    });
});

test("Logged in user can access admin dashboard with user role", async () => {
  // Assume you already have an admin role assigned to this user
  await api
    .get("/users/admin/dashboard")
    .set("Authorization", `Bearer ${token}`)
    .expect(403)
    
});

afterAll(async () => {
  await User.destroy({ where: {} }); // Clear the users table
});
