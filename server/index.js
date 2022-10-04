const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('html-pdf');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// POST - PDF generation and fetching of the data
app.post('/create-pdf', (req, res) => {
    // Get today's date
    const today = new Date();
    // structure data
    const dataReceived = {
        ...req.body,
        today
    }

    ejs.renderFile(path.join(__dirname, './documents/index.ejs'), dataReceived, (err, data) => {
        if (err) {
            res.send(err)
        }else{
            pdf.create(data, {format: 'Letter'}).toFile('pdf/result.pdf', (err) => {
                if(err) {
                    res.send(Promise.reject());
                }

                res.send(Promise.resolve());
            });
        }
    });
});

// GET - Send the generated PDF to the client
app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/pdf/result.pdf`)
});

app.listen(port, () => console.log(`Listening on port ${port}`));