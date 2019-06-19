const express = require('express');
const layouts = require('express-ejs-layouts');
const fs = require('fs');
const methodOverride = require('method-override');

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(methodOverride('_method'));

app.get('/', function (req, res) {
    res.send('we should add some nice landing page stuff here');
});

//GET a list of the articles
app.get('/articles', function (req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    res.render('articles/index', {articleData});
});

//GET a new article
app.get('/articles/new', function (req, res) {
    res.render('articles/new');
});

//GET a form to edit articles
app.get('/articles/:id/edit', function (req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    let id = parseInt(req.params.id);
    res.render('articles/edit', {article: articleData[id], id});
});

//GET a single article
app.get('/articles/:id', function (req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    let id = parseInt(req.params.id);
    res.render('articles/show', {article: articleData[id], id})
});

//POST the new article
app.post('/articles', function (req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);

    let newArticle = {
        title: req.body.articleTitle,
        body: req.body.articleBody
    }
    articleData.push(newArticle);
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect('/articles');
});

//Update article
app.put('/articles/:id', function (req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    let id = parseInt(req.params.id);
    articleData[id].title = req.body.articleTitle;
    articleData[id].body = req.body.articleBody;
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect('/articles');
});

//DELETE article
app.delete('/articles/:id', function (req, res) {
    let articles = fs.readFileSync('./articles.json');
    let articleData = JSON.parse(articles);
    let id = parseInt(req.params.id);
    articleData.splice(id, 1);
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect('/articles');
});

app.listen( PORT || 3000 , function () {
    console.log('mystery science theater ' + PORT );
});
