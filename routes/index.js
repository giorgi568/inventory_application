var express = require('express');
var router = express.Router();

const category_controller = require('../controllers/categoryController');
const item_controller = require('../controllers/itemController')

/* GET home page. */
router.get('/', category_controller.index);

// category routes

router.get('/categories/create', category_controller.create_get);
router.post('/categories/create', category_controller.create_post);

router.get('/categories/:id', category_controller.detail);

router.get('/categories/:id/update', category_controller.update_get);
router.post('/categories/:id/update', category_controller.update_post);

router.get('/categories/:id/delete', category_controller.delete_get);
router.post('/categories/:id/delete', category_controller.delete_post);

// item routes
router.get('/items/:id', item_controller.detail);


module.exports = router;
