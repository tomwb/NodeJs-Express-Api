const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mailer = require('../modules/mailer');
const authConfig = require('../../config/auth');
const User = require('../models/user');

const router = express.Router();

// gerar token
function generateToken(params = {}) {
	return jwt.sign(params, authConfig.secret, {
		expiresIn: 86400,
	});
}

// cadastra um novo usuario
router.post('/register', async (req, res) => {
	const { email } = req.body;

	try {
		if ( await User.findOne({ email }) ){
			return res.status(400).send({'error' : 'User already exists'});
		}

		const user = await User.create(req.body); 

		// remove o password para retornar
		user.password = undefined;
		
		return res.send({
			user,
			token:  generateToken({ id: user.id })
		});
	} catch (err) {
		return res.status(400).send({ 'error' : 'Registration failed' });
	}
});

// autentica o usuario
router.post('/authenticate', async (req, res) => {
	const { email, password } = req.body;

	// procura por um user com este email, e força o retorno do password
	const user = await User.findOne({ email }).select('+password');

	// caso não encontre user
	if (!user) {
		return res.status(400).send({ 'error' : 'User not found!' });
	}

	// caso as senhas não batam
	if (!await bcrypt.compare(password, user.password)) {
		return res.status(400).send({ 'error' : 'Invalid password' });
	}

	// remove o password para retornar
	user.password = undefined;

	return res.send({
		user,
		token:  generateToken({ id: user.id })
	});
});

// esqueci minha senha
router.post('/forgot-password', async (req, res) => {
	const {email} = req.body;

	try {

		// procura por um user com este email, e força o retorno do password
		const user = await User.findOne({ email });

		// caso não encontre user
		if (!user) {
			return res.status(400).send({ 'error' : 'User not found!' });
		}

		// gera um token aleatorio em hexadecimal
		const token = crypto.randomBytes(20).toString('hex')

		// hora de expiração
		const now = new Date();
		now.setHours(now.getHours() + 1);

		await User.findByIdAndUpdate( user.id, {
			'$set': {
				passwordResetToken: token,
				passwordResetExpires: now
			}
		});

		mailer.sendMail({
			to: email,
			from: 'tomwb1@gmail.com',
			template: 'auth/forgot_password',
			'context': {token}
		}, (err) => {
			if (err) {
				return res.status(400).send({ 'error' : 'Cannot send forgot password email' });
			}

			return res.send();
			
		});


	} catch (err) {
		return res.status(400).send({ 'error' : 'Forgot Password failed' });
	}
});

module.exports = app => app.use('/auth', router);