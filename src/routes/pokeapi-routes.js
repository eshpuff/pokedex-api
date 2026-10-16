const express = require('express');
const controller = require('../controllers/pokemon-controller');

const router = express.Router();

router.get('/:nameOrId', controller.searchPokeApi);

module.exports = router;