const express = require('express');
const db = require('./data/db');
const dbRouter = require('./data/router');

const server = express();


server.get('/', (req, res) =>{
    res.send(`<h2>Lambda School</h2>`);
});

server.use('/api/posts', dbRouter);



const port = 5000;
server.listen(port, () => console.log('I am the second part'))