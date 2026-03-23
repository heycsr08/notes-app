const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to read notes
const getNotes = () => {
    try {
        const data = fs.readFileSync("notes.json");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper function to save notes
const saveNotes = (notes) => {
    fs.writeFileSync("notes.json", JSON.stringify(notes, null, 2));
};

// 1. Get all notes
app.get("/notes", (req, res) => {
    const notes = getNotes();
    res.json(notes);
});

// 2. Add a note
app.post("/notes", (req, res) => {
    const notes = getNotes();
    const newNote = {
        id: Date.now(),
        content: req.body.content
    };
    notes.push(newNote);
    saveNotes(notes);
    res.json(newNote);
});

// 3. Delete a note
app.delete("/notes/:id", (req, res) => {
    let notes = getNotes();
    notes = notes.filter(note => note.id != req.params.id);
    saveNotes(notes);
    res.json({ message: "Note deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
