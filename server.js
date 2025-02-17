

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
import netflixTitles from "./data/netflix-titles.json";
import listEndpoints from "express-list-endpoints"; 

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
// const port = process.env.PORT || 8080;
// const port = process.env.PORT || 9090;
const port = process.env.PORT || 9000;

const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const movieSchema = new mongoose.Schema({
  show_id: Number,
  title: String,
  director: String,
  cast: [String],
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: [String],
  description: String
});

const Movie = mongoose.model("Movie", movieSchema);



if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Movie.deleteMany();
    netflixTitles.forEach((singleTitle) => {
      const newMovie = new Movie(singleTitle);
      newMovie.save()
    })
  }
  resetDatabase();
}

// Start defining your routes here
// app.get("/", (req, res) => {
//   res.send("Hello Technigo!");
// });

app.get("/", (req, res) => {  // Root route
  res.send("I work! Hey there!");
res.send(listEndpoints(app));
});

app.get("/movies", async (req, res) => {
  const { title, director, cast } = req.query;
  const response = {
    success: true,
    body: {}
  }
  //below: i = case insensitiv
  const titleRegex = new RegExp(title, "i"); 
  const directorRegex = new RegExp(director, "i");
  const castRegex = new RegExp(cast, "i");

  try {
    const searchResultFromDB = await Movie.find({ title: titleRegex, director: directorRegex, cast: castRegex })
    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false,
        res.status(500).json(response)
    }
  } catch (e) {
    res.status(500).json(response)
  }

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})});