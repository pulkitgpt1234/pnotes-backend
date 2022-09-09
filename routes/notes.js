const express = require("express");
const fetchuser = require("../middlewares/fetchuser");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");
//ROUTE1 fetch all notes of a user endpoint GET"/api/notes/fetchallnotes", login required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const notes = await Note.find({ user: userId }); //user is field for storign userId in noteSchema.
    res.json(notes);
  } catch (error) {
    res.json({500:"Internal server error", message:error.message});
  }
});

//ROUTE2 post a note by a user endpoint POST"/api/notes/createnote", login required.
router.post(
  "/createnote",
  fetchuser,
  [
    body("title", "title should be at least 5 chars").isLength({ min: 5 }),
    body("description", "description should be at least 15 chars").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body; //this is called destructuring.

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({ user: req.user.id, title, description, tag });
      const savedNote = await note.save(); // we can use savedNote = await Note.create as well
      res.json(savedNote);
    } catch (error) {
      res.json({500:"Internal server error", message:error.message});
    }
  }
);

//ROUTE3 update note of logged in user endpoint PUT"/api/notes/updatenote/:id/", login required.
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) res.status(404).send("Not found");

    const noteUserId = note.user.toString();
    if (req.user.id !== noteUserId) res.send(401).send("Not allowed");

    //if note is there for same user then update it
    const { title, description, tag } = req.body;

    const updatedNote = {};
    if (title) updatedNote.title = title;
    if (description) updatedNote.description = description;
    if (tag) updatedNote.tag = tag;
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.json({500:"Internal server error", message:error.message});
  }
});

//ROUTE4 delete note of logged in user endpoint DELETE"/api/notes/deletenote/:id" , login required.
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {
        const note=await Note.findById(req.params.id);
        if (!note) res.status(404).send("Not found");
        const noteUserId=note.user.toString();
        if(noteUserId!==req.user.id)
            res.send(401).send("Not allowed");
        const deletedNote=await Note.findByIdAndDelete(req.params.id);
        res.json({message:"success",deleted_note : deletedNote});

    } catch (error) {
      res.json({500:"Internal server error", message:error.message});
    }
});
module.exports = router;
