const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// prepara para receber json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
// 	res.send('OK');
// });

require('./controllers/authController')(app);

// incializa o servidor
app.listen(3000);