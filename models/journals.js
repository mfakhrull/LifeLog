import mongoose from "mongoose";


// Create a Mongoose Schema and Model for tasks
const journalSchema = new mongoose.Schema({
    title: String,
    journal: String,
    date: String,
  });
  
  const Journal = mongoose.model("Journal", journalSchema);

  export default Journal;
