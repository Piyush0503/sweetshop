const express = require('express');
const router = express.Router();
const controller = require('../controllers/sweetController');

router.get('/', controller.getAll);
router.get('/search', controller.search);
router.post('/', controller.add);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.put('/:id/purchase', controller.purchase);
router.put('/:id/restock', controller.restock);

module.exports = router;
