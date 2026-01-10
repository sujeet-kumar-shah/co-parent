import mongoose from "mongoose";

const likedSchema = new mongoose.Schema({
   listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   status: {
      type: Boolean,
      default: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

const Liked = mongoose.model('Liked', likedSchema);

export default Liked;