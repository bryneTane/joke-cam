const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const dotenv = require('dotenv')
const userRouter = require('./routes/user-router');
const jokeRouter = require('./routes/joke-router');
const quoteRouter = require('./routes/quote-router');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();
const apiPort = 3001;
const webpush = require('web-push');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: '300mb' }));

dotenv.config();

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

app.use('/api', userRouter);
app.use('/api', jokeRouter);
app.use('/api', quoteRouter);

app.post('/notifications/subscribe', (req, res) => {
    const subscription = req.body

    console.log(subscription)

    var subscriptions = db.collection('subscriptions');
    if(subscription.subs){
        subscriptions.replaceOne({ subs: subscription.subs }, subscription, { upsert: true })
            .then(rep => {
                console.log(rep);
                res.status(200).json({ 'success': true });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ error: err });
            });
    }
    
});

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