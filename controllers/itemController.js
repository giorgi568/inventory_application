const Item = require('../models/item');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');

exports.detail = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('category').exec();

    res.render('item_detail', {
      name: item.name,
      description: item.description,
      price: item.price,
      numberInStock: item.numberInStock,
      categoryName: item.category.name,
      itemUrl: item.url,
    });
  } catch (err) {
    return next(err);
  }
};

exports.create_get = async (req, res, next) => {
  try {
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    res.render('item_form', {
      title: 'Create Item',
      categories: allCategories,
    });
  } catch (err) {
    return next(err);
  }
};

exports.create_post = [
  body('name', 'name must not be empty').trim().isLength({ min: 1 }).escape(),
  body('description', 'description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'error with price')
    .trim()
    .custom((value) => {
      value = parseFloat(value);
      if (typeof value !== 'number') {
        throw new Error('price should be a number');
      } else if (value > 500000) {
        throw new Error('price should be lower than 500000');
      } else if (value < 0) {
        throw new Error('price should be positive number');
      } else {
        return true;
      }
    }),
  body('numberInStock', 'error with number in stock')
    .trim()
    .custom((value) => {
      value = parseFloat(value);
      if (typeof value !== 'number') {
        throw new Error('number in stock should be a number');
      } else if (value > 100000) {
        throw new Error('number in stock should be lower than 100000');
      } else if (value < 0) {
        throw new Error('number in stock should be a positive number');
      } else if (!Number.isInteger(value)) {
        throw new Error('number should be an integer');
      } else {
        return true;
      }
    }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        category: req.body.category,
      });

      if (!errors.isEmpty()) {
        const allCategories = await Category.find().sort({ name: 1 }).exec();

        res.render('item_form', {
          title: 'Create Item',
          categories: allCategories,
          errors: errors.array(),
          item: item,
        });
      } else {
        await item.save();
        res.redirect(item.url);
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.update_get = async (req, res, next) => {
  try {
    const [allCategories, item] = await Promise.all([
      Category.find().sort({ name: 1 }).exec(),
      Item.findById(req.params.id).populate('category').exec(),
    ]);

    if (item === null) {
      const err = new Error('item not found');
      err.status = 404;
      return next(err);
    }

    res.render('item_form', {
      title: 'Update Item',
      categories: allCategories,
      item: item,
    });
  } catch (err) {
    return next(err);
  }
};

exports.update_post = [
  body('name', 'name must not be empty').trim().isLength({ min: 1 }).escape(),
  body('description', 'description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'error with price')
    .trim()
    .custom((value) => {
      value = parseFloat(value);
      if (typeof value !== 'number') {
        throw new Error('price should be a number');
      } else if (value > 500000) {
        throw new Error('price should be lower than 500000');
      } else if (value < 0) {
        throw new Error('price should be positive number');
      } else {
        return true;
      }
    }),
  body('numberInStock', 'error with number in stock')
    .trim()
    .custom((value) => {
      value = parseFloat(value);
      if (typeof value !== 'number') {
        throw new Error('number in stock should be a number');
      } else if (value > 100000) {
        throw new Error('number in stock should be lower than 100000');
      } else if (value < 0) {
        throw new Error('number in stock should be a positive number');
      } else if (!Number.isInteger(value)) {
        throw new Error('number should be an integer');
      } else {
        return true;
      }
    }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        category: req.body.category,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        const allCategories = await Category.find().sort({ name: 1 }).exec();

        res.render('item_form', {
          title: 'Create Item',
          categories: allCategories,
          errors: errors.array(),
          item: item,
          errors: errors.array(),
        });
      } else {
        const updatedItem = await Item.findByIdAndUpdate(
          req.params.id,
          item,
          {}
        );
        res.redirect(updatedItem.url);
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_get = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).exec();

    if (item === null) {
      res.redirect('/');
    }

    res.render('item_delete', {
      title: 'Delete Item',
      item: item,
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete_post = async (req, res, next) => {
  try {
    await Item.findByIdAndDelete(req.body.itemId);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
};
