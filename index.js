const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  fs = require("fs"),
  morgan = require("morgan"),
  path = require("path");

app.use(bodyParser.json());

// log requests
app.use(morgan("common"));

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

let users = [
  {
    id: 1,
    name: "Jacob",
    favoritemovies: [],
  },
  {
    id: 2,
    name: "Andrew",
    favoritemovies: ["Reservoir Dogs"],
  },
];

// Top ten Movies
let movies = [
  {
    Title: "Reservoir Dogs",
    Description:
      "Six criminals with pseudonyms, and each strangers to one another, are hired to carry out a robbery. The heist is ambushed by police and the gang are forced to shoot their way out. At their warehouse rendezvous, the survivors, realising that they were set up, try to find the traitor in their midst.",
    Author: "Quentin Tarantino",
    Director: {
      Name: "Quentin Tarantino",
      Bio: "Born March 27, 1963 is an American film director, screenwriter, and actor. His films are characterized by stylized violence, extended dialogue including a pervasive use of profanity, and references to popular culture. He has been considered 'the single most influential director of his generation'.",
      "Birth Year": 1963,
    },
    Year: 1992,
    Genre: {
      Name: "Gangster",
      Description:
        "A film belonging to a genre that focuses on gangs and organized crime. It is a subgenre of crime film",
    },
    Line: "Are You Gonna Bark All Day, Little Doggy, Or Are You Gonna Bite?",
  },
  {
    Title: "2001:A Space Odyssey",
    Description:
      "When Dr. Dave Bowman and other astronauts are sent on a mysterious mission, their ship's computer system, HAL, begins to display increasingly strange behavior, leading up to a tense showdown between man and machine that results in a mind-bending trek through space and time.",
    Author: "Arthur C Clarke",
    Director: {
      Name: "Stanley Kubrick",
      Bio: "Born July 26, 1928 was an American film director, producer, screenwriter and photographer. Widely considered one of the greatest filmmakers of all time, his films—nearly all of which are adaptations of novels or short stories—span a number of genres and are known for their intense attention to detail, innovative cinematography, extensive set design and dark humor.",
      "Birth Year": 1928,
    },
    Year: 1968,
    Genre: {
      Name: "Science Fiction",
      Description:
        "A film that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies.",
    },
    Line: "I'm sorry, Dave; I'm afraid I can't do that.",
  },
  {
    Title: "The Godfather",
    Description:
      "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
    Author: "Francis Ford Coppola",
    Director: {
      Name: "Francis Ford Coppola",
      Bio: "Born April 7, 1939 is an American film director, producer and screenwriter. He is considered one of the leading figures of the New Hollywood film movement of the 1960s and 1970s and is widely considered one of the greatest directors of all time. Coppola is the recipient of five Academy Awards, six Golden Globe Awards, two Palmes d'Or and a British Academy Film Award (BAFTA).",
      "Birth Year": 1939,
    },
    Year: 1972,
    Genre: {
      Name: "Gangster",
      Description:
        "A film belonging to a genre that focuses on gangs and organized crime. It is a subgenre of crime film",
    },
    Line: "I'm gonna make him an offer he can't refuse.",
  },
  {
    Title: "Raiders of the Lost Ark",
    Description:
      "Epic tale in which an intrepid archaeologist tries to beat a band of Nazis to a unique religious relic which is central to their plans for world domination. Battling against a snake phobia and a vengeful ex-girlfriend, Indiana Jones is in constant peril, making hair's-breadth escapes at every turn in this celebration of the innocent adventure movies of an earlier era.",
    Author: "George Lucas",
    Director: {
      Name: "Steven Spielberg",
      Bio: "Born December 18, 1946 is an American film director, producer and screenwriter. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history.[1] He is the recipient of many accolades, including three Academy Awards, two BAFTA Awards, and four Directors Guild of America Awards, as well as the AFI Life Achievement Award in 1995, the Kennedy Center Honor in 2006, the Cecil B. DeMille Award in 2009 and the Presidential Medal of Freedom in 2015. Seven of his films have been inducted into the National Film Registry by the Library of Congress as 'culturally, historically or aesthetically significant'",
      "Birth Year": 1946,
    },
    Year: 1981,
    Genre: {
      Name: "Adventure",
      Description:
        "A film containing many of the same features of action movies, but are usually set in exotic locations. The main theme is adventure, with the characters often exploring places they have not been before or doing things they have not done before.",
    },
    Line: "It's not the years, honey, it's the mileage.",
  },
  {
    Title: "Goodfellas",
    Description:
      "A young man grows up in the mob and works very hard to advance himself through the ranks. He enjoys his life of money and luxury, but is oblivious to the horror that he causes. A drug addiction and a few mistakes ultimately unravel his climb to the top.",
    Author: "Martin Scorsese",
    Director: {
      Name: "Martin Scorsese",
      Bio: "Born November 17, 1942 is an American film director, producer, screenwriter and actor. He emerged as one of the major figures of the New Hollywood era. Scorsese has received many accolades, including an Academy Award, four BAFTA Awards, three Emmy Awards, a Grammy Award, three Golden Globe Awards, and two Directors Guild of America Awards. He has been honored with the AFI Life Achievement Award in 1997, the Film Society of Lincoln Center tribute in 1998, the Kennedy Center Honor in 2007, the Cecil B. DeMille Award in 2010, and the BAFTA Fellowship in 2012. Five of his films have been inducted into the National Film Registry by the Library of Congress as 'culturally, historically or aesthetically significant'.",
      "Birth Year": 1942,
    },
    Year: 1990,
    Genre: {
      Name: "Gangster",
      Description:
        "A film belonging to a genre that focuses on gangs and organized crime. It is a subgenre of crime film",
    },
    Line: "As far back as I can remember, I always wanted to be a gangster.",
  },
  {
    Title: "The Dark Knight",
    Description:
      "Follows the vigilante Batman, police lieutenant James Gordon, and district attorney Harvey Dent, who form an alliance to dismantle organized crime in Gotham City. Their efforts are derailed by the Joker, an anarchistic mastermind who seeks to test how far Batman will go to save the city from chaos.",
    Author: "Christopher Nolan",
    Director: {
      Name: "Christopher Nolan",
      Bio: "Born 30 July 1970 is a British and American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century. His films have grossed more than $6 billion worldwide. The recipient of many accolades, he has been nominated for five Academy Awards, five BAFTA Awards and eight Golden Globe Awards. In 2015, he was listed as one of the 100 most influential people in the world by Time, and in 2019, he was appointed Commander of the Order of the British Empire for his contributions to film.",
      "Birth Year": 1970,
    },
    Year: 2008,
    Genre: {
      Name: "Adventure",
      Description:
        "A film containing many of the same features of action movies, but are usually set in exotic locations. The main theme is adventure, with the characters often exploring places they have not been before or doing things they have not done before.",
      Line: "What doesn't kill you, simply makes you stranger!",
    },
  },
  {
    Title: "Jaws",
    Description:
      "When a killer shark unleashes chaos on a beach community off Cape Cod, it's up to a local sheriff, a marine biologist, and an old seafarer to hunt the beast down.",
    Author: "Steven Spielberg",
    Director: {
      Name: "Steven Spielberg",
      Bio: "Born December 18, 1946 is an American film director, producer and screenwriter. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history.[1] He is the recipient of many accolades, including three Academy Awards, two BAFTA Awards, and four Directors Guild of America Awards, as well as the AFI Life Achievement Award in 1995, the Kennedy Center Honor in 2006, the Cecil B. DeMille Award in 2009 and the Presidential Medal of Freedom in 2015. Seven of his films have been inducted into the National Film Registry by the Library of Congress as 'culturally, historically or aesthetically significant'",
      "Birth Year": 1946,
    },
    Year: 1975,
    Genre: {
      Name: "Thriller",
      Description:
        "A broad film genre that evokes excitement and suspense in the audience. The suspense element found in most films' plots is particularly exploited by the filmmaker in this genre.",
    },
    Line: "You're gonna need a bigger boat.",
  },
  {
    Title: "Star Wars",
    Description:
      "The original trilogy depicts the heroic development of Luke Skywalker as a Jedi and his fight against Palpatine's Galactic Empire alongside his sister, Leia.",
    Author: "George Lucas",
    Director: {
      Name: "George Lucas",
      Bio: "Born May 14, 1944 is an American filmmaker and philanthropist. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, Industrial Light & Magic, and THX. He served as chairman of Lucasfilm before selling it to The Walt Disney Company in 2012.Lucas is one of history's most financially successful filmmakers and has been nominated for four Academy Awards. Lucas personally directed or conceived 10 of the 100 highest-grossing movies at the North American box office, Lucas is considered to be one of the most significant figures of the 20th-century New Hollywood movement, and a pioneer of the modern blockbuster. Despite this, he has remained an independent filmmaker away from Hollywood for most of his career.",
      "Birth Year": 1944,
    },
    Year: 1977,
    Genre: {
      Name: "Science Fiction",
      Description:
        "A film that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies.",
    },
    Line: "May the force be with you.",
  },
  {
    Title: "Pulp Fiction",
    Description:
      "VTwo hitmen with a penchant for philosophical discussions, in this ultra-hip, multi-strand crime movie, their storyline is interwoven with those of their boss, his actress wife, struggling boxer; master fixer and a nervous pair of armed robbers.",
    Author: "Quentin Tarantino",
    Director: {
      Name: "Quentin Tarantino",
      Bio: "Born March 27, 1963 is an American film director, screenwriter, and actor. His films are characterized by stylized violence, extended dialogue including a pervasive use of profanity, and references to popular culture. He has been considered 'the single most influential director of his generation'.",
      "Birth Year": 1963,
    },
    Year: 1994,
    Genre: {
      Name: "Indie film",
      Description:
        "What sets them apart from mainstream movies is their intimate nature due to their small budgets and independence. Therefore, indie films tend to focus more on storytelling than visual effects and A-list celebrity casting.",
    },
    Line: "They call it a Royale with cheese.",
  },
  {
    Title: "Blade Runner",
    Description:
      "Deckard is forced by the police Boss to continue his old job as Replicant Hunter. His assignment: eliminate four escaped Replicants from the colonies who have returned to Earth. Before starting the job, Deckard goes to the Tyrell Corporation and he meets Rachel, a Replicant girl he falls in love with.",
    Author: " Hampton Fancher",
    Director: {
      Name: "Ridley Scott",
      Bio: "Born 30 November 1937 is an English filmmaker. He is best known for directing films in the science fiction, crime, and historical drama genres. His work is known for its atmospheric and highly concentrated visual style. Scott has received many accolades, including the BAFTA Fellowship for lifetime achievement in 2018, two Primetime Emmy Awards, and a Golden Globe Award. In 2003, he was knighted by Queen Elizabeth II.",
      "Birth Year": 1937,
    },
    Year: 1982,
    Genre: {
      Name: "Science Fiction",
      Description:
        "A film that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies.",
    },
    Line: "I've seen things you people wouldn't believe.",
  },
];

//CREATE
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("User needs Name");
  }
});

//UPDATE
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("User does not exisit");
  }
});

//CREATE
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoritemovies.push(movieTitle);
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("User does not exist");
  }
});

//DELETE
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoritemovies = user.favoritemovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("User does not exist");
  }
});

//DELETE User

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(` User ${id} has been deleted`);
  } else {
    res.status(400).send("User not found");
  }
});

// READ Front Page
app.get("/", (req, res) => {
  res.send("Welcome to the Top Movies Page!");
});

//READ List of Movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//READ Movie Titles
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send("Movie not listed here");
  }
});

// READ genre by name
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Genre not in this Top List.");
  }
});
// READ Director by name
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("Director not in this Top List.");
  }
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get("/documentation.html", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("HAL, I think we have a problem.");
});

app.listen(8080, () => {
  console.log("My server is running on port 8080.");
});
