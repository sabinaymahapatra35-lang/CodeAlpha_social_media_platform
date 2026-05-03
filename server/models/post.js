// ============================================
// POST MODEL
// ============================================
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [500, 'Post cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  // Add virtual for comment count
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: get comments linked to this post
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId'
});

module.exports = mongoose.model('Post', postSchema);
