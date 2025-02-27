const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const jwt = require("jsonwebtoken");

let token = "";
let adminToken = "";
let userId;
let adminId;
let appointmentId;

beforeAll(async () => {
  // Clear tables before tests
  await Appointment.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  // Register a normal user
  const userRes = await api.post("/users/register").send({
    username: "testUser",
    password: "test123",
    fullname: "Test User",
    email: "testUser@gmail.com",
  });

  // Log in as a normal user
  const loginUserRes = await api.post("/users/login").send({
    username: "testUser",
    password: "test123",
  });

  token = loginUserRes.body.token;
  userId = jwt.verify(token, process.env.SECRET).id;

  // Register an admin user
  const adminRes = await api.post("/users/register").send({
    username: "adminUser",
    password: "admin123",
    fullname: "Admin User",
    email: "adminUser@gmail.com",
  });

  // Log in as an admin
  const loginAdminRes = await api.post("/users/login").send({
    username: "adminUser",
    password: "admin123",
  });

  adminToken = loginAdminRes.body.token;
  adminId = jwt.verify(adminToken, process.env.SECRET).id;

  // Promote the admin user
  await User.update({ role: "admin" }, { where: { id: adminId } });
});

test("User can create an appointment request", async () => {
  const appointmentData = {
    requestedDate: "2025-03-01T10:00:00Z",
  };

  await api
    .post("/appointment/")
    .set("Authorization", `Bearer ${token}`)
    .send(appointmentData)
    .expect(201)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.success).toBe(true);
     
      expect(res.body.appointment.status).toBe("pending");
      expect(res.body.appointment.userId).toBe(userId);
      appointmentId = res.body.appointment.id; // Store the appointment ID for later tests
    });
});

test("Admin can get all appointment", async () => {
  await api
    .get("/appointment/")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      
      expect(Array.isArray(res.body.appointments)).toBe(true);
      expect(res.body.appointments.length).toBeGreaterThan(0);
    });
});

test("Admin can update appointment status", async () => {
  await api
    .put(`/appointment/${appointmentId}`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ status: "accepted" })
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      console.log(res.body)
      expect(res.body.success).toBe(true);
      expect(res.body.appointment.status).toBe("accepted");
    });
});

test("Admin can get pending appointment", async () => {
  await api
    .get("/appointment/pending")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      console.log(res.body)
      expect(Array.isArray(res.body.appointments)).toBe(true);
    });
});

test("Admin can get accepted appointment", async () => {
  await api
    .get("/appointment/accepted")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(Array.isArray(res.body.appointments)).toBe(true);
      expect(res.body.appointments.some((appt) => appt.status === "accepted")).toBe(true);
    });
});

test("Admin can get rejected appointment", async () => {
  await api
    .get("/appointment/rejected")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(Array.isArray(res.body.appointments)).toBe(true);
    });
});

afterAll(async () => {
  await Appointment.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });
});
