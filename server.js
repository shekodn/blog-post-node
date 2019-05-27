const express = require('express');
const app = express();
const uuid = require('uuid');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//Blog posts: ("data base")
blogPostArray = [
    {
        id: uuid.v4(),
        title: "First Post",
        content: "This is Marcelas's first post",
        author: "Marcela",
        publishDate: '24-Mar-19'
    },
    {
        id: uuid.v4(),
        title: "Second Post",
        content: "This is Sergio's first post",
        author: "Paulina",
        publishDate: '25-Mar-19'
    },
    {
        id: uuid.v4(),
        title: "Third Post",
        content: "This is Hernan's first post",
        author: "Carlos",
        publishDate: '26-Mar-19'
    },
    {
        id: uuid.v4(),
        title: "Fourth Post",
        content: "This is Ana Karen's first post",
        author: "Alejandro",
        publishDate: '27-Mar-19'
    }
]

app.get("/", function(req, res){
  res.status(200)
  res.send("Hello from the application directory");
});


//GET to check its working
app.get('/', (req, res) => {

//   res.format ({
//  'text/plain': function() {
//     res.status(204)
//     res.send('hey');
//  },
//
//  'text/html': function() {
//     res.send('hey');
//  },
//
//  'application/json': function() {
//     res.send({ message: 'hey' });
//  },
//
//  'default': function() {
//     // log the request and respond with 406
//     res.status(406).send('Not Acceptable');
//  }
// });

    res.status(200).json({
        message: "Working!",
        format: 'text/html',
        status: 200,
    });
});

//GET request of all blog posts
app.get('/blog-posts', (request, response) => {
    response.status(200).json({
        message: "Successfully sent all blog posts.",
        status: 200,
        posts: blogPostArray
    });
});

//GET by author requests
app.get('/blog-posts/:author', (request, response) => {
    let postAuthor = request.params.author;
    const authorPostsArray = [];

    if(!postAuthor){
        response.status(406).json({
            message: "Missing author",
            status: 406
        });
    }

    blogPostArray.forEach(item => {
        if(postAuthor == item.author){
            authorPostsArray.push(item);
        }
    });

    if(authorPostsArray.length > 0){
        response.status(200).json({
            message: "Successfully sent the list of author posts",
            status: 200,
            post: authorPostsArray
        });
    }else{ //author doesn't exist:
        response.status(404).json({
            message : "Author doesn't exist",
            status : 404
        });
    }
});


//POST requests of a blog post
app.post('/blog-posts', jsonParser, (request, response) => {
    let postTitle = request.body.title;
    let postAuthor = request.body.author;
    let postContent = request.body.content;
    let postPublishDate = request.body.publishDate;
    let requiredFields = ['title', 'content', 'author', 'publishDate'];

    for (let x = 0; x < requiredFields.length; x++){
        let currentField = requiredFields[x];
        if(!(currentField in request.body)){
            response.status(406).json({
                message : `${currentField} field is missing`,
                status : 406
            }).send("Finish");
        }
    }

    let newPost = {
        id: uuid.v4(),
        title: postTitle,
        content: postContent,
        author: postAuthor,
        publishDate: postPublishDate
    };
    blogPostArray.push(newPost);

    response.status(201).json({
        message: "Successfully added post",
        status: 201,
        post: newPost
    });
});

//DELETE requests
app.delete('/blog-posts/:id', jsonParser, (request, response) => {
    let bodyId = request.body.id;
    let paramsId = request.params.id;

    if(!bodyId || !paramsId || bodyId != paramId){
        response.status(406).json({
            message: "Missing id",
            status: 406
        });
        return;
    }

    blogPostArray.forEach((item, index) => {
        if(paramsId == item.id){
            delete blogPostArray[index];
            response.status(204).send("Finish");
            return;
        }
    });

    res.status(404).json({
        message: "Post not found",
        status: 404
    });
});


//PUT requests
app.put('/blog-posts/:id', jsonParser, (request, response) => {
    let postId = request.params.id;
    let postToReplace = request.body;
    let newPost = null;

    if(!postId){
        response.status(406).json({
            message: "Missing id",
            status: 406
        });
    }

    if(!postToReplace.title && !postToReplace.content && !postToReplace.author && !postToReplace.publishDate){
        response.status(404).json({
            message: "Missing field in body",
            status: 404
        });
    }else{
        blogPostArray.forEach(item => {
            if(postId == item.id){
                if(postToReplace.title) {item.title = postToReplace.title;}
                if(postToReplace.content) {item.content = postToReplace.content;}
                if(postToReplace.author) {item.author = postToReplace.author;}
                if(postToReplace.publishDate) {item.publishDate = postToReplace.publishDate;}
                newPost = item;

                response.status(200).json({
                    message: "Successfully updated post",
                    status: 200,
                    post: newPost
                });
            }
        });
    }
    response.status(404).json({
        message: 'ID doesnt exist',
        status: 404,
    });

});


app.listen(8080, () => {
    console.log("App is running in port 8080");
});
