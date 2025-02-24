const express = require("express");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { verifyUser, verifyAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/uploads");

router
  .route("/")
  .get(postController.getAllPosts)
  .post(verifyUser, postController.createPost)
  .put((req, res) => res.status(405).json({ error: "Method not allowed" }))
  .delete((req, res) => res.status(405).json({ error: "Method not allowed" }));

router.post(
  "/uploadPostCover",
  verifyUser,verifyAdmin,
  upload,
  postController.uploadPostCover
);

// Get posts uploaded by others
router.get("/others", verifyUser, postController.getPostsUploadedByOthers);

// Get posts uploaded by current user
router.get(
  "/my-posts",
  verifyUser,verifyAdmin,
  postController.getPostsUploadedByCurrentUser
);



// Search posts
router.get("/search", postController.searchPosts);

router
  .route("/:post_id")
  .get(postController.getPostById)
  .post((req, res) => {
    res.status(405).json({ error: "POST request is not allowed" });
  })
  .put(postController.updatePostById)
  .delete(postController.deletePostById);





module.exports = router;
