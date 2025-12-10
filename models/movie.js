const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  director: { type: String, required: true },
  duration: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now }
});


movieSchema.index({ title: "text" });

module.exports = mongoose.model("Movie", movieSchema);
