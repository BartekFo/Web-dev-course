import express from 'express';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import { data } from './data.js';
import _ from 'lodash';
import mongoose from 'mongoose';
const { Schema } = mongoose;

//zmienne
const app = express();
const port = 3000;
const { homeStartingContent, aboutContent, contactContent } = data;
const posts = [];

//ustawienia apki
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//Obsługa bazy danych
mongoose.connect('mongodb://localhost:27017/BlogWebsite', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
	});

	const Post = mongoose.model('Post', PostSchema);

	//routning
	app.get('/', (req, res) => {
		Post.find((err, foundPosts) => {
			if (!err) {
				res.render('home', {
					homeText: data.homeStartingContent,
					posts: foundPosts,
				});
			}
		});
	});

	app.get('/about', (req, res) => {
				res.render('about', {
					aboutText: aboutContent,
				});
	});

	app.get('/contact', (req, res) => {
				res.render('contact', {
					contactText: contactContent,
				});
	});

	app.get('/compose', (req, res) => {
		res.render('compose');
  });

	//routing do różnych postów
	app.get('/posts/:postName', (req, res) => {
    const postName = req.params.postName;
    Post.findOne({title: postName}, (err, post)=>{
      if(!err){
				res.render('post', {
				post,
				});
			}
    })
	});

	//posty
	app.post('/', (req, res) => {
		const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody,
    });
    post.save((err)=>{
      if(!err){
        res.redirect('/');
      }
    });

	});
});

//listening
app.listen(port, () => {
	console.log('Server started on port 3000');
	console.log('Running on http://localhost:3000');
});
