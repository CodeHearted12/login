const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');

const app = express();

// Configure mustache

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

// configure body parser

app.use(bodyParser.urlencoded({
  extended: false
}));


//for your styling coming from public folder
app.use(express.static('public'));

app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: true
}));

let info = {
  'username': 'myron',
  'password': 'anthony'
}

let auth = function(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  } else {
    return res.sendStatus(401);

  }
}


app.get('/', function(req, res) {
  if (req.session && req.session.admin) {
    res.redirect('/content');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(res, req) {
  if (req.body.username === info.username && req.body.password === info.password) {
    console.log(req.body);
    req.session.admin = true;
    res.redirect('/');

  }
});



app.get('/content', auth, function(req, res) {
  res.render('content');
});


app.get('/logout', function(req, res) {
  req.session.destroy();
  res.render('logout');

});


app.listen(3000, function() {
  console.log('Catch_a_Murray started on port 3000...')
});
