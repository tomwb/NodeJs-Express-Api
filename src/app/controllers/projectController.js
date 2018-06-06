const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// faz passar pelo middleware
router.use(authMiddleware);

router.get('/', (req, res) => {
	res.send({ok: true});
});

module.exports = app => app.use('/projects', router);