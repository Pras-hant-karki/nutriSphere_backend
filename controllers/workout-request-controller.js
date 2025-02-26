const WorkoutRequest = require("../models/workout_request");


// Create a new workout request (User)
exports.createRequest = async (req, res) => {
  try {
    const { height, weight, age, goal } = req.body;
    const userId = req.user.id; // User ID from verifyUser middleware

    if (!height || !weight || !age || !goal) {
      return res.status(400).json({ error: "All fields (height, weight, age, goal) are required" });
    }

    const workoutRequest = await WorkoutRequest.create({
      userId,
      height,
      weight,
      age,
      goal,
    });

    res.status(201).json({
      message: "Workout request created successfully",
      workoutRequest,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

