// controllers/postController.js
const { Op } = require("sequelize");
const Post = require("../models/Posts");
const User = require("../models/User");

const formatTimeDifference = (createdAt) => {
  const currentTime = new Date();
  const timeDifference = Math.abs(currentTime - new Date(createdAt));

  if (timeDifference < 60000) {
    return `${Math.floor(timeDifference / 1000)} seconds ago`;
  } else if (timeDifference < 3600000) {
    return `${Math.floor(timeDifference / 60000)} minutes ago`;
  } else if (timeDifference < 86400000) {
    return `${Math.floor(timeDifference / 3600000)} hours ago`;
  } else {
    return `${Math.floor(timeDifference / 86400000)} days ago`;
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

const getPostsUploadedByOthers = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;

    const [posts, userInfo] = await Promise.all([
      Post.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username"],
          },
        ],
      }),
      User.findByPk(loggedInUserId, {
        include: [
          {
            model: Post,
            as: "postmarkedPosts",
          },
        ],
      }),
    ]);

    const otherPosts = posts.map((post) => {
      const isPostmarked = userInfo.postmarkedPosts.some(
        (postmarked) => postmarked.id === post.id
      );

      return {
        ...post.get({ plain: true }),
        formattedCreatedAt: formatTimeDifference(post.createdAt),
        isPostmarked,
      };
    });

    const otherPostsUploadedBy = otherPosts.filter(
      (post) => post.user && post.user.id !== loggedInUserId
    );

    res.json({
      data: otherPostsUploadedBy,
    });
  } catch (error) {
    next(error);
  }
};

const getPostsUploadedByCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const posts = await Post.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json({
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

let uploadedFilename;

const uploadPostCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    uploadedFilename = req.file.filename;
    res.status(200).json({ success: true, data: uploadedFilename });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  const { topic, description } = req.body;
  const user = req.user;
  const postCover = uploadedFilename || "";

  try {
    if (!topic || !description) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const post = await Post.create({
      topic,
      description,
      postCover,
      userId: user.id,
    });

    const postWithUser = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.status(201).json(postWithUser);
  } catch (error) {
    next(error);
  } finally {
    uploadedFilename = undefined;
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.post_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }

    res.json({
      data: [post],
    });
  } catch (error) {
    next(error);
  }
};

const updatePostById = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.update(req.body);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const deletePostById = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const searchPosts = async (req, res, next) => {
  const { query } = req.query;

  try {
    const posts = await Post.findAll({
      where: {
        [Op.or]: [{ topic: { [Op.iLike]: `%${query}%` } }],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    if (posts.length === 0) {
      return res.json({ message: "No posts found" });
    }

    res.json({
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostsUploadedByOthers,
  getPostsUploadedByCurrentUser,
  uploadPostCover,
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
  searchPosts,
};
