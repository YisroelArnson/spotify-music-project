const { Router } = require('express');
const express = require('express');
const router = express.Router();
const trackController = require('../controllers/track');

router.post('/playlist', trackController.add_full_playlist);

router.post('/tracks', trackController.add_tracks)

module.exports = router;
