const express = require('express');
const app = express();

const social = require('./routes/social');
const suggestions = require('./routes/suggestions');
const ranking = require('./routes/ranking');
const dashboard = require('./routes/dashboard');

// Firestore
const Firestore = require('@google-cloud/firestore');
const db = new Firestore();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.use('/api/social', social);
app.use('/api/suggestions', suggestions);
app.use('/api/ranking', ranking);
app.use('/api/dashboard', dashboard);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));