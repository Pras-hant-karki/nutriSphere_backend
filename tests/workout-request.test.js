const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User");
const WorkoutRequest = require("../models/workout_request");
const jwt = require("jsonwebtoken");

let token = "";
let adminToken = "";
let userId;
let adminId;
let requestId;

// Setup test environment before all tests
beforeAll(async () => {
  await WorkoutRequest.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  // Create a regular user
  const userRes = await api.post("/users/register").send({
    username: "testUser",
    password: "test123",
    fullname: "Test User",
    email: "testuser@gmail.com",
  });

  const userLoginRes = await api.post("/users/login").send({
    username: "testUser",
    password: "test123",
  });

  token = userLoginRes.body.token;
  const userPayload = jwt.verify(token, process.env.SECRET);
  userId = userPayload.id;

  // Create an admin user
  const adminRes = await api.post("/users/register").send({
    username: "adminUser",
    password: "admin123",
    fullname: "Admin User",
    email: "admin@gmail.com",
  });

  const adminLoginRes = await api.post("/users/login").send({
    username: "adminUser",
    password: "admin123",
  });

  adminToken = adminLoginRes.body.token;
  const adminPayload = jwt.verify(adminToken, process.env.SECRET);
  adminId = adminPayload.id;

  // Make the user an admin
  await User.update({ role: "admin" }, { where: { id: adminId } });
});
test("User can create a workout request", async () => {
    const newRequest = {
      height: 170,
      weight: 70,
      age: 25,
      goal: "Build muscle",
    };
  
    const res = await api
      .post("/workout-requests/")
      .set("Authorization", `Bearer ${token}`)
      .send(newRequest)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  
    requestId = res.body.workoutRequest.id;
  
    expect(res.body.message).toBe("Workout request created successfully");
    expect(res.body.workoutRequest.userId).toBe(userId);
    expect(res.body.workoutRequest.status).toBe("pending");
  });

  test("User can get their workout requests", async () => {
    const res = await api
      .get("/workout-requests/")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Admin can get all workout requests", async () => {
    const res = await api
      .get("/workout-requests/getAllRequests")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("User can update their workout request", async () => {
    const updatedData = {
      height: 175,
      weight: 72,
      age: 26,
      goal: "Lose weight",
    };
  
    const res = await api
      .put(`/workout-requests/${requestId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    expect(res.body.message).toBe("Workout request updated successfully");
    expect(res.body.request.height).toBe(175);
  });

  test("User can delete their pending workout request", async () => {
    // Create a new request to delete
    const newRequest = await api
      .post("/workout-requests/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        height: 170,
        weight: 70,
        age: 25,
        goal: "Get fit",
      });
  
    const deleteRequestId = newRequest.body.workoutRequest.id;
  
    // Now delete it
    const res = await api
      .delete(`/workout-requests/${deleteRequestId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  
    expect(res.body.message).toBe("Workout request deleted successfully");
  });

  test("Admin can respond to a workout request", async () => {
    const responseData = {
      workoutPlan: "Customized weightlifting plan",
    };
  
    const res = await api
      .put(`/workout-requests/${requestId}/respond`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(responseData)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  
    expect(res.body.message).toBe("Workout plan submitted successfully");
    expect(res.body.request.status).toBe("completed");
    expect(res.body.request.workoutPlan).toBe(responseData.workoutPlan);
  });

  afterAll(async () => {
    await WorkoutRequest.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  