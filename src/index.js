const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// prepara para receber json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// adiciona os controllers
require('./app/controllers')(app);

// incializa o servidor
app.listen(3000);