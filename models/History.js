/**
 * History model
 * Append-only audit log of point claims.
 * Read patterns:
 * - Global feed: timestamp desc
 * - Per user: (userId, timestamp desc)
 */


const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    points: { type: Number, required: true, min: 1, max: 10 },
    timestamp: { type: Date, default: Date.now }
  },
  {
    versionKey: false 
  }
);

// Helpful index for fetching a user's recent claims
historySchema.index({ userId: 1, timestamp: -1 });

// Clean JSON output: _id -> id, hide __v if present
historySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v; // hide even if existing docs still have it
    return ret;
  }
});

historySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('History', historySchema);
