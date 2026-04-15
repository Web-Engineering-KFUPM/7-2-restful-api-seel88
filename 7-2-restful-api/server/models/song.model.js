import mongoose from "mongoose";

// db schema
const songSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true
  },
  artist: {
    type: String, 
    required: true
  },
  year: {
    type: Number, 
    required: true
  }
});

export const Song = mongoose.model("Song", songSchema);