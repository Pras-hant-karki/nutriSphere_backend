// controllers/postController.js
const { Op } = require('sequelize');
const { Post, User } = require('../models/Posts');

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
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
    });

    res.json({
      data: posts
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
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }]
      }),
      User.findByPk(loggedInUserId, {
        include: [{
          model: Post,
          as: 'postmarkedPosts'
        }]
      })
    ]);

    const otherPosts = posts.map(post => {
      const isPostmarked = userInfo.postmarkedPosts.some(
        postmarked => postmarked.id === post.id
      );

      return {
        ...post.get({ plain: true }),
        formattedCreatedAt: formatTimeDifference(post.createdAt),
        isPostmarked
      };
    });

    const otherPostsUploadedBy = otherPosts.filter(
      post => post.user && post.user.id !== loggedInUserId
    );

    res.json({
      data: otherPostsUploadedBy
    });
  } catch (error) {
    next(error);
  }
};

const getAllPostmarkedPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: Post,
        as: 'postmarkedPosts',
        through: { attributes: [] }
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const postmarkedPosts = user.postmarkedPosts.map(post => ({
      ...post.get({ plain: true }),
      formattedCreatedAt: formatTimeDifference(post.createdAt),
      isPostmarked: true
    }));

    res.status(200).json({ data: postmarkedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPostsUploadedByCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const posts = await Post.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
    });

    res.json({
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

let uploadedFilename;

const uploadPostCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
    }

    uploadedFilename = req.file.filename;
    res.status(200).json({ success: true, data: uploadedFilename });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  const { title, author, description, genre, language } = req.body;
  const user = req.user;
  const postCover = uploadedFilename || '';

  try {
    if (!title || !author || !description || !genre || !language) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const post = await Post.create({
      title,
      author,
      description,
      genre,
      language,
      postCover,
      userId: user.id
    });

    const postWithUser = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
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
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
    });

    if (!post) {
      return res.status(404).json({ error: 'post not found' });
    }

    res.json({
      data: [post]
    });
  } catch (error) {
    next(error);
  }
};

const updatePostById = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.post_id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
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
      return res.status(404).json({ error: 'Post not found' });
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
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { author: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username']
      }]
    });

    if (posts.length === 0) {
      return res.json({ message: 'No posts found' });
    }

    res.json({
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

const postmarkPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.post_id;

    const [user, post] = await Promise.all([
      User.findByPk(userId),
      Post.findByPk(postId)
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postmarked = await user.hasPostmarkedPosts(post);
    if (postmarked) {
      return res.status(400).json({ error: 'Post is already postmarked' });
    }

    await user.addPostmarkedPosts(post);
    res.status(201).json({ message: 'Post postmarked successfully' });
  } catch (error) {
    next(error);
  }
};

const removePostmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.post_id;

    const [user, post] = await Promise.all([
      User.findByPk(userId),
      Post.findByPk(postId)
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postmarked = await user.hasPostmarkedPosts(post);
    if (!postmarked) {
      return res.status(400).json({ error: 'Post is not postmarked' });
    }

    await user.removePostmarkedPosts(post);
    res.json({ message: 'Postmark removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostsUploadedByOthers,
  getAllPostmarkedPosts,
  getPostsUploadedByCurrentUser,
  uploadPostCover,
  createPost,
  getPostById,
  updatePostById,
  deletePostById,
  searchPosts,
  postmarkPost,
  removePostmark
};