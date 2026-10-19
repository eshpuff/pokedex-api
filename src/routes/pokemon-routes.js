const express = require('express');
const controller = require('../controllers/pokemon-controller');
const { authenticate } = require('../middlewares/auth-middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;