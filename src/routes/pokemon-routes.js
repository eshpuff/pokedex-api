const express = require('express');
const controller = require('../controllers/pokemon-controller');
const { authenticate } = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authenticate, controller.create);
router.patch('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;