const Category = require('../models/category');
const Item = require('../models/item');

const { body, validationResult } = require('express-validator');

exports.index = async (req, res, next) => {
  try {
    const [numCategory, categories] = await Promise.all([
      Category.countDocuments({}).exec(),
      Category.find({}).exec(),
    ]);

    res.render('index', {
      category_count: numCategory,
      categories: categories,
      title: 'Inventory Application',
    });
  } catch (err) {
    return next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();
    const itemsInCategory = await Item.find({ category: req.params.id });

    res.render('category_detail', {
      categoryName: category.name,
      categoryDescription: category.description,
      items: itemsInCategory,
    });
  } catch (err) {
    return next(err);
  }
};

exports.create_get = (req, res, next) => {
  res.render('category_form', {
    title: 'Create New Category',
  });
};

exports.create_post = [
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
];
