const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('manageUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('manageUsers'), validate(userValidation.getUser), userController.getUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUserAdmin), userController.updateUser);

module.exports = router;
