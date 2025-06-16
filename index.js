require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    const customObjects = 'https://api.hubapi.com/crm/v3/objects/books?properties=name,genre,author';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(customObjects, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Hubspot Library', data });      
    } catch (error) {
        console.error('API Error:');
        res.status(500).send('Error fetching books');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const book = {
        properties: {
            "name": req.body.name,
            "genre": req.body.genre,
            "author": req.body.author
        }
    };

    const createObject = 'https://api.hubapi.com/crm/v3/objects/books';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(createObject, book, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error creating book');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));