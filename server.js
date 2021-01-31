const express = require('express');
const app = express ();
const es6Renderer = require('express-es6-template-engine');
const port = process.env.PORT || 3000;

app.use (express.json());
app.use (express.urlencoded({extended: false}));


app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

var threads = [
    {
        id: 1,
        title: "Test Thread 1",
        content: "This is a test forum post with id 1",
        comments: [
            {
                id: 1,
                name: "Vera",
                message: "very cool!"
            },
            {
                id: 2,
                name: "Felix",
                message: "what vera said!"
            }
        ]
    },
    {
        id: 2,
        title: "Test Thread 2",
        content: "this is a test forum post with id 2.",
        comments: [
            {
                id: 1,
                name: "Jake",
                message: "a finished project is a good project"
            }
        ]
    }
];
// GET home page
app.get('/', (req, res) => {
    res.render('home');
});

// GET api/threads/

app.get('/threads', (req, res,) => {
    console.log ('get rewuuest to threads');
  res.json(threads);
});

// GET threads/:id -- Render a Single Post
app.get('/threads/:id', (req, res) => {
    const id = req.params.id;
    const thread = threads.find(thread => thread.id === parseInt(id));
    
    // res.json(thread);
    if (thread) {
        res.render('thread', {
            locals: {
                thread
            }
        });
    } else {
        res.status(404)
            .send(`no thread with id ${id}`)
    }
});

// 

app.listen(port, function(){
    console.log('Forum API is now listening on port '+port+'...');
});