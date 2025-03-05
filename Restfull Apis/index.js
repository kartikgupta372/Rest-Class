const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "The Boys",
        content: "I like posting"
    },
    {
        id: uuidv4(),
        username: "Kartik Gupta",
        content: "Hard work is the key to success"
    },
    {
        id: uuidv4(),
        username: "random",
        content: "I am a random person"
    },
];

// Redirect `/` to `/posts`
app.get("/", (req, res) => {
    res.redirect("/posts");
});

// Show all posts
app.get('/posts', (req, res) => {
    res.render("index.ejs", { posts });
});

// Show form to create a new post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

// Create a new post
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

// Show a single post
app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    
    if (!post) {
        return res.status(404).send("Post not found");
    }
    
    res.render("show.ejs", { post });
});

// Show form to edit a post
app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("edit.ejs", { post });
});

// Update a post
app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => p.id === id);
    post.content = newContent;
    res.redirect(`/posts/`);
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/posts");
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
