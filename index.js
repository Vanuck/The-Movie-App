const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

let topmovies = [
  {
    title: "Reservoir Dogs",
    author: "Quentin Tarantino",
    year: 1992,
    line: "Are You Gonna Bark All Day, Little Doggy, Or Are You Gonna Bite?",
  },
  {
    title: "2001:A Space Odyssey",
    author: "Arthur C Clarke",
    year: 1968,
    line: "I'm sorry, Dave; I'm afraid I can't do that.",
  },
  {
    title: "The Godfather",
    author: "Francis Ford Coppola",
    year: 1972,
    line: "I'm gonna make him an offer he can't refuse.",
  },
  {
    title: "Raiders of the Lost Ark",
    author: "Steven Spielberg",
    year: 1981,
    line: "It's not the years, honey, it's the mileage.",
  },
  {
    title: "Goodfellas",
    author: "Martin Scorsese",
    year: 1990,
    line: "As far back as I can remember, I always wanted to be a gangster.",
  },
  {
    title: "The Dark Knight",
    author: "Christopher Nolan",
    year: 2008,
    line: "What doesn't kill you, simply makes you stranger!",
  },
  {
    title: "Jaws",
    author: "Steven Spielberg",
    year: 1975,
    line: "You're gonna need a bigger boat.",
  },
  {
    title: "Star Wars",
    author: "George Lucas",
    year: 1977,
    line: "May the force be with you.",
  },
  {
    title: "Pulp Fiction",
    author: "Quentin Tarantino",
    year: 1994,
    line: "They call it a Royale with cheese.",
  },
  {
    title: "Blade Runner",
    author: "Ridley Scott",
    year: 1982,
    line: "I've seen things you people wouldn't believe.",
  },
];

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to The Movie App!");
});
app.get("/documentation.html", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});
app.get("/movies", (req, res) => {
  res.json(topmovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("HAL, I think we have a problem.");
});

app.listen(8080, () => {
  console.log("My server is running on port 8080.");
});
