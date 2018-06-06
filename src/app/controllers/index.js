const fs = require('fs');
const path = require('path');

module.exports = app => {
	// passa por todos os arquivos da pasta, incluindo eles caso eles não comecem com .
	fs
		.readdirSync(__dirname)
		.filter(file => ( (file.indexOf('.')) !== 0 && (file !== "index.js") ))
		.forEach(file => {
			require(path.resolve(__dirname, file))(app)
		});
};