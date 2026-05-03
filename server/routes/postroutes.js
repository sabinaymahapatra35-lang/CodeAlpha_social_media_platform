// ============================================
// POST ROUTES
// ============================================
const express = require('express');
const router = express.Router();
const {
  getFeed,
  getExplorePosts,
  getUserPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/feed',           protect, getFeed);
router.get('/explore',        protect, getExplorePosts);
router.get('/user/:userId',   protect, getUserPosts);
router.get('/:id',            protect, getPost);
router.post('/',              protect, upload.single('image'), createPost);
router.put('/:id',            protect, upload.single('image'), updatePost);
router.delete('/:id',         protect, deletePost);
router.post('/:id/like',      protect, toggleLike);

module.exports = router;
