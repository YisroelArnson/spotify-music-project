const { Router } = require('express');
const express = require('express');
const router = express.Router();
const trackController = require('../controllers/track');
const checkInsights = require('../middleware/check-insights');


router.post('/playlist', trackController.add_full_playlist);
router.post('/tracks', checkInsights, trackController.add_tracks);

module.exports = router;
