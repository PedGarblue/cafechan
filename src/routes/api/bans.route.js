const express = require('express');

const bansController = require('../../controllers/ban.controller');
const validate = require('../../middlewares/validate');
const bansValidation = require('../../validations/ban.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(auth('bans'), validate(bansValidation.getBans), bansController.getBans)
  .post(auth('bans'), validate(bansValidation.addBan), bansController.addBan);

router.route('/:banId').delete(auth('bans'), validate(bansValidation.deleteBan), bansController.deleteBan);

module.exports = router;
