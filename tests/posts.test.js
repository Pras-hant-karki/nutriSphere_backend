const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/User"); // Sequelize User model
const Post = require("../models/Posts"); // Sequelize Post model
const jwt = require("jsonwebtoken");

let token = "";
let userId;

beforeAll(async () => {
  await Post.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });

  // Register a user
  const res = await api.post("/users/register").send({
    username: "testUser",
    password: "test123",
    fullname: "Test User",
    email: "test2@gmail.com",
  });

  // Log in and get the token
  const loginRes = await api.post("/users/login").send({
    username: "testUser",
    password: "test123",
  });

  token = loginRes.body.token;
  const payload = jwt.verify(token, process.env.SECRET);
  userId = payload.id;
  await User.update({ role: 'admin' }, { where: { id: userId } });
});

test("User can create a post", async () => {
  const newPost = {
    topic: "Test Post",
    description: "This is a test post.",
  };

  await api
    .post("/posts/")
    .set("Authorization", `Bearer ${token}`)
    .send(newPost)
    .expect(201)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
     
     
      expect(res.body.topic).toBe(newPost.topic);
      expect(res.body.description).toBe(newPost.description);
      expect(res.body.user.id).toBe(userId);
    });
});

test("User can get all posts", async () => {
  await api
    .get("/posts/")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0); // Should return at least 1 post
    });
});

test("User can get their own posts", async () => {
  await api
    .get("/posts/my-posts")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      expect(res.body.data[0].user.id).toBe(userId);
    });
});

test("User can update a post", async () => {
  // Create a new post first
  const postResponse = await api
    .post("/posts/")
    .set("Authorization", `Bearer ${token}`)
    .send({
      topic: "Post to update",
     
      description: "This post will be updated",
      
    });

  const postId = postResponse.body.id;
  console.log(postResponse.body)

  // Update the post
  await api
    .put(`/posts/${postId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      topic: "Updated Post topic",
      description: "Updated description for the post",
    })
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      console.log(res.body)
      expect(res.body.topic).toBe("Updated Post topic");
      expect(res.body.description).toBe("Updated description for the post");
    });
});

test("User can delete their post", async () => {
  // Create a new post first
  const postResponse = await api
    .post("/posts/")
    .set("Authorization", `Bearer ${token}`)
    .send({
      topic: "Post to delete",
    
      description: "This post will be deleted",
     
    });

  const postId = postResponse.body.id;

  // Delete the post
  await api
    .delete(`/posts/${postId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);
});

test("Search posts by topic", async () => {
  // Create a post to search
  const postResponse = await api
    .post("/posts/")
    .set("Authorization", `Bearer ${token}`) // Include token
    .send({
      topic: "Searchable Post",
      description: "This post is for search testing.",
    });

  console.log("Created Post:", postResponse.body);

  const searchQuery = "Searchable Post";

  await api
    .get(`/posts/search?query=${searchQuery}`)
    .set("Authorization", `Bearer ${token}`) // Include token here
    .expect(200)
    .expect("Content-Type", /application\/json/)
    .then((res) => {
      console.log("Search Response:", res.body);
      expect(res.body.data[0].topic).toBe("Searchable Post");
    });
});


afterAll(async () => {
  try {
    // Ensure posts are deleted first to avoid foreign key constraints
    await Post.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });

    // Close the Sequelize connection to prevent open handles
    
  } catch (error) {
    console.error("Error during teardown:", error);
  }
});

