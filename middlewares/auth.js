const jwt = require("jsonwebtoken");
const User= require("../models/User")

const verifyAdmin = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Auth token not present" });

  token = token.split(" ")[1];

  try {
    const payload = await jwt.verify(token, process.env.SECRET);
    console.log(payload.id)
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
const verifyUser = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "auth token not present" });
  token = token.split(" ")[1];

  try {
    const payload = await jwt.verify(token, process.env.SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { verifyUser , verifyAdmin };
