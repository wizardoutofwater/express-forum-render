const express = require("express");
const morgan = require("morgan");
const app = express();
const es6Renderer = require("express-es6-template-engine");
const session = require("express-session");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SECRET_KEY || "dev",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.engine("html", es6Renderer);
app.set("views", "templates");
app.set("view engine", "html");
// app.use(express.static(__dirname + 'public'));
var threads = [
  {
    id: 1,
    title: "Test Thread 1",
    name: "John",
    content: "This is a test forum post with id 1",
    comments: [
      {
        id: 1,
        name: "Vera",
        content: "very cool!",
      },
      {
        id: 2,
        name: "Felix",
        content: "what vera said!",
      },
    ],
  },
  {
    id: 2,
    title: "Test Thread 2",
    name: "Sarah",
    content: "this is a test forum post with id 2.",
    comments: [
      {
        id: 1,
        name: "Jake",
        content: "a finished project is a good project",
      },
    ],
  },
];

let idCount = 2;
let commentCount = 3;

// GET home page
app.get("/", (req, res) => {
  res.render("home", {
    partials: {
      head: "/partials/head",
    },
  });
});

// GET api/threads/
app.get("/threads", (req, res) => {
  // throw new Error("Something went wrong!");
  console.log("get rewuuest to threads");
  //   res.json(threads);
  res.render("threadList", {
    locals: {
      threads,
    },
    partials: {
      head: "/partials/head",
    },
  });
});

// GET threads/:id -- Render a Single Post
app.get("/threads/:id", (req, res) => {
  const id = req.params.id;
  const thread = threads.find((thread) => thread.id === parseInt(id));

  if (thread) {
    res.render("thread", {
      locals: {
        thread,
      },
      partials: {
        head: "/partials/head",
      },
    });
  } else {
    // res.status(404).send(`no thread with id ${id}`);
    const error = new Error("Not found");
    error.status = 404;
    console.log(error.status);
    res.render("error", {
      locals: {
        thread,
        error,
      },
      partials: {
        head: "/partials/head",
      },
    });
  }
});

// POST /threads -- making a new thread
app.post("/threads", (req, res) => {
  console.log(req.body);
  // error method below will force a content key
  if (!req.body.content || req.body.content == "") {
    res.status(400).send("Forum Thread Empty. Please include content key");
    return;
  }
  // push new thread w/ new id.
  threads.push({ ...req.body, comments: [], id: ++idCount });
  res.render("threadList", {
    locals: {
      threads,
    },
    partials: {
      head: "/partials/head",
    },
  });
});

// PUT /threads/:id  -- Add a Comment? Or reserve this route for editing a message? -  should i add a /threads/:id/comments POST route?
app.put("/threads/:id", (req, res) => {
  console.log(req.body);
  let id = req.params.id;
  if (!req.body.content || req.body.content == "") {
    res.status(400).send("bad request it needs content key.");
    return;
  }

  let thread = threads.find((thread) => thread.id === parseInt(id));
  thread.comments.push({ ...req.body, id: ++commentCount });
});

// POST /threads/:id/comments -- testing using POST method to add comments.
app.post("/threads/:id/comments", (req, res) => {
  console.log(req.body);
  let id = req.params.id;

  if (!req.body.content || req.body.content == "") {
    res.status(400).send("bad request it needs content key.");
    return;
  }
  let thread = threads.find((thread) => thread.id === parseInt(id));
  thread.comments.push({ ...req.body, id: ++commentCount });

  res.render("thread", {
    locals: {
      thread,
    },
    partials: {
      head: "/partials/head",
    },
  });
});

// DELETE /threads/:id -- Delete a thread
app.delete("/threads/:id", (req, res) => {
  threads = threads.filter((element) => element.id !== parseInt(req.params.id));
  res.json(threads);
});



// PUT /threads/:id/comments/:commentId -- edit a comment

// DELETE /threads/:id/comments/:commentId -- delete a comment


// Routes to catch all routing/server errors not caught inside route declarations
//  -- goes right before app.listen

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  // res.status(error.status || 500).send({
  //   error: {
  //     status: error.status || 500,
  //     message: error.message || "Internal Server Error",
  //   },
  // });
  error.status = error.status || 500;
  error.message = error.message || "internal server error";

  res.render("error", {
    locals: {
      error,
    },
    partials: {
      head: "/partials/head",
    },
  });
});

app.listen(port, function () {
  console.log("Forum API is now listening on port " + port + "...");
});
