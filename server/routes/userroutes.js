// ============================================
// USER ROUTES
// ============================================
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserByUsername,
  updateProfile,
  followUser,
  searchUsers,
  getNotifications,
  getUnreadCount
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/search',              protect, searchUsers);
router.get('/notifications',       protect, getNotifications);
router.get('/notifications/count', protect, getUnreadCount);
router.put('/profile',             protect, upload.single('profilePic'), updateProfile);
router.get('/username/:username',  protect, getUserByUsername);
router.get('/:id',                 protect, getUserProfile);
router.post('/:id/follow',         protect, followUser);

module.exports = router;
