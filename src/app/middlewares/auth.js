const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization;

	// verifica se veio o header
	if (!authHeader) {
		return res.status(401).send({'error': 'No token provided'});
	}

	// verifica se o header tem 2 partes
	const parts = authHeader.split(' ');

	if (!parts.lenght ===2){
		return res.status(401).send({'error': 'Token error'});
	}

	const [ scheme, token ] = parts;

	// verifica se na header tem o valor Bearer
	if (!/^Bearer$/i.test( scheme )) {
		return res.status(401).send({'error': 'Token malformatted'});
	}
	
	// verifica o token
	jwt.verify(token, authConfig.secret, (err, decoded) => {
		if (err){
			return res.status(401).send({'error': 'Token invalid'});
		}

		req.userId = decoded.id;
		return next();
	});
};