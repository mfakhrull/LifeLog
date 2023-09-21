import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config'
import dayjs from "dayjs";
import Journal from './models/journals.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


async function connectDB() {
  try {
      await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      console.log("Successfully connected to the database!");
  } catch (error) {
      console.error("Error connecting to the database:", error.message);
      process.exit(1);
  }
}


app.get("/", (req, res) => {
  res.redirect("/write");
});

app.get("/write", async (req, res) => {
  try {
    const currentTime = dayjs().format("DD-MM-YYYY");
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
  const currentTime = dayjs().format("DD-MM-YYYY");
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

// Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
  });
});

