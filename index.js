const express = require("express"),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

const morgan = require("morgan");
const app = express();
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
const cors = require("cors");
app.use(cors());

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

//Password Hashing section
app.post("/users", async (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

const logDirectory = path.join(__dirname, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const logFilePath = path.join(logDirectory, "access.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

app.use(morgan("combined", { stream: logStream }));

app.use(express.static("public"));

// READ Front Page
app.get("/", (req, res) => {
  res.send("Welcome to the Top Movies Page!");
});

//DELETE a user
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // CONDITION ENDS
    Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + "was not found");
        } else {
          res.status(200).send(req.params.Username + "was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET list of all users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//GET all movies on server
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
//GET search for movie by title
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
//GET search for movies by genre
app.get(
  "/movies/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ "Genre.Name": req.params.genreName })
      .then((Movies) => {
        res.status(201).json(Movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
//GET search for movies by the director name
app.get(
  "/movies/directors/:directorsName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ "Director.Name": req.params.directorsName })
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        res.status(500).send("Error: " + err);
      });
  }
);
//CREATE a new user and adds them to DB
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username }).then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + "already exists");
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
    }
  });
});

//UPDATE user to save movies as a favorite
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $addToSet: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send("Error: User doesn't exist");
        } else {
          res.json(updatedUser);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//UPDATE user information and only allow access to registered user
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // CONDITION TO CHECK ADDED HERE
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    // CONDITION ENDS
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//error code catcher
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("HAL, I think we have a problem.");
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
