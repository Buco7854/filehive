const express = require('express');
const router = express.Router();
const {index} = require('../controllers/index.controller');
const {entityMiddleware} = require("../middlewares/entity.middleware");

router.get('/:path(*)', entityMiddleware, index);

module.exports = router;
