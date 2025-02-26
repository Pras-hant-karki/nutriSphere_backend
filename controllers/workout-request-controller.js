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

// Get all workout requests for the logged-in user (User)
exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await WorkoutRequest.findAll({ where: { userId } });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all pending requests (User/Admin)

// Get all pending requests (Admin sees all, User sees only their own)
exports.getPendingRequests = async (req, res) => {
    try {
      const whereCondition = req.user.role === "admin"
        ? { status: "pending" }
        : { userId: Number(req.user.id), status: "pending" }; // Ensure userId is a number
  
      const requests = await WorkoutRequest.findAll({ where: whereCondition });
  
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get all completed (responded) requests (Admin sees all, User sees only their own)
  exports.getCompletedRequests = async (req, res) => {
    try {
      const whereCondition = req.user.role === "admin"
        ? { status: "completed" }
        : { userId: Number(req.user.id), status: "completed" }; // Ensure userId is a number
  
      const requests = await WorkoutRequest.findAll({ where: whereCondition });
  
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Get a single workout request by ID (Only owner or admin)
exports.getRequestById = async (req, res) => {
  try {
    const request = await WorkoutRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Ensure that only the owner of the request or an admin can view it
    if (req.user.role !== "admin" && req.user.id !== request.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User can update their request if it's still pending
exports.updateRequest = async (req, res) => {
  try {
    const { height, weight, age, goal } = req.body;
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await WorkoutRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "Workout request not found" });
    }

    if (request.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Cannot update a completed request" });
    }

    request.height = height;
    request.weight = weight;
    request.age = age;
    request.goal = goal;
    await request.save();

    res.status(200).json({
      message: "Workout request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User can delete their request if it's still pending
exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await WorkoutRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "Workout request not found" });
    }

    if (request.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Cannot delete a completed request" });
    }

    await request.destroy();

    res.status(200).json({ message: "Workout request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin responds with a workout plan
exports.respondToRequest = async (req, res) => {
  try {
    const { workoutPlan } = req.body;
    const requestId = req.params.id;

    const request = await WorkoutRequest.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ message: "Workout request not found" });
    }

    request.workoutPlan = workoutPlan;
    request.status = "completed";
    await request.save();

    res.status(200).json({
      message: "Workout plan submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllRequests = async (req, res) => {
    try {
        const requests = await WorkoutRequest.findAll();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};