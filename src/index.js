const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// prepara para receber json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// adiciona o controller
require('./controllers/authController')(app);
require('./controllers/projectController')(app);

// incializa o servidor
app.listen(3000);