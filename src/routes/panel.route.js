const express = require('express');
const panelController = require('../controllers/panel.controller');

const router = express.Router();

router.route('/*').get(panelController.getPanel);

module.exports = router;
