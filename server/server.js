const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRouter = require('./routes/user-router');
const jokeRouter = require('./routes/joke-router');
const quoteRouter = require('./routes/quote-router');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();
const apiPort = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({limit: '100mb'}));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api', userRouter);
app.use('/api', jokeRouter);
app.use('/api', quoteRouter);

// const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/joke-cam.friedrich-tane.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/joke-cam.friedrich-tane.tech/fullchain.pem'),
}, app);

// httpServer.listen(80, () => {
//     console.log('HTTP Server running on port 80');
// });

httpsServer.listen(apiPort, () => {
    console.log(`HTTPS Server running on port ${apiPort}`);
});

// app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));