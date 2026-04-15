import express from "express";
import cors from "cors";

// import dotenv and load environment variables from .env
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());

await connectDB(process.env.MONGO_URL);

// api/songs (Read all songs)
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// /api/songs/:id (Read a single song)
app.get('/api/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// api/songs (Insert song)
app.post('/api/songs', async (req, res) => {
  try {
    const { title, artist, year } = req.body; 
    
    const newSong = await Song.create({
      title: title,
      artist: artist,
      year: year
    });
    res.status(201).json(newSong); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// /api/songs/:id (Update song)
app.put('/api/songs/:id', async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,
        runValidators: true 
      } 
    );
    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json(updatedSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// /api/songs/:id (Delete song)
app.delete('/api/songs/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: "Song not found" });
    }
    // Autograder fix for TODO 6: Returns 204 No Content
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));