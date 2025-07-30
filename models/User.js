/**
 * User model
 * - name: unique display name
 * - totalPoints: leaderboard score (updated via $inc for atomicity)
 *
 * Indexes:
 * - name: unique (prevents duplicates)
 * - (totalPoints desc, updatedAt asc, name asc): deterministic leaderboard sort
 */


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    totalPoints: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false 
  }
);

userSchema.index({ name: 1 }, { unique: true });

// For leaderboard sorting — deterministic tie-breaks
userSchema.index(
    { totalPoints: -1, updatedAt: 1, name: 1 },
    { collation: { locale: 'en', strength: 2 } }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v; 
    return ret;
  }
});

userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
