import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  stars: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
}, {
  timestamps: true
});

export default mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
