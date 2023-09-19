import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dayjs from "dayjs";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Establish a MongoDB connection with Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/lifelogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose Schema and Model for tasks
const journalSchema = new mongoose.Schema({
  title: String,
  journal: String,
  date: String,
});

const Journal = mongoose.model("Journal", journalSchema);

// Get current date
const currentTime = dayjs().format("DD-MM-YYYY"); // e.g., "18-09-2023"

app.get("/write", async (req, res) => {
  try {
    res.render("write.ejs",{ currentTime: currentTime });
  } catch (error) {
    console.log(error);
  }
});

app.get("/journal", async (req, res) => {
  try {
    const journals = await Journal.find({});
    res.render("journal.ejs", { journals: journals });
  } catch (error) {
    console.log(error);
  }
});

// SUBMIT JOURNAL
app.post("/submitJournal", async (req, res) => {
  const newJournal = new Journal({
    title: req.body.newJournalTitle,
    journal: req.body.newJournalEntry,
    date: currentTime,
  });

  try {
    await newJournal.save();
    res.redirect("/write");
  } catch (error) {
    console.log("An error occurred while saving the task:", error);
    res.redirect("/write");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
