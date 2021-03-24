const { Router } = require('express');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', authController.spotify_login);
router.post('/access_token', authController.get_access_token)
router.get('/access_token', authController.get_fetch_access_token)

module.exports = router;
