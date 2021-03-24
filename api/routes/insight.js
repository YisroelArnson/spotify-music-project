const { Router } = require('express');
const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insight');

router.get('/insight', insightController.fetch_insight);

module.exports = router;
