require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let urlDatabase=[];
let counter=1;

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res){
    const url=req.body.url;

    const urlRegex = /^(http|https)(:\/\/)/;
    if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

    const short_url=counter++;

    urlDatabase[short_url]=url;

    return res.json({original_url:url, short_url:short_url});
});

app.get('/api/shorturl/:short_url', function(req, res){
    const short_url=req.params.short_url;
    const original_url=urlDatabase[short_url];

    if(original_url){
        return res.redirect(original_url);
    }else{
        return res.json({error: 'invalid url'});
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
