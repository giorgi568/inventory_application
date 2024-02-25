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
      categoryUrl: category.url,
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
  body('description', 'Category description must contain al least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });

      if (!errors.isEmpty()) {
        res.render('category_form', {
          title: 'Create Category',
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        const categoryExists = await Category.findOne({ name: req.body.name })
          .collation({ locale: 'en', strength: 2 })
          .exec();

        if (categoryExists) {
          res.redirect(categoryExists.url);
        } else {
          await category.save();
          res.redirect(category.url);
        }
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.update_get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();
    res.render('category_form', {
      title: 'Update Category',
      category: category,
    });
  } catch (err) {
    return next(err);
  }
};

exports.update_post = [
  body('name', 'Category name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Category description must contain al least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.render('category_form', {
          title: 'Create Category',
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        const categoryExists = await Category.findOne({ name: req.body.name })
          .collation({ locale: 'en', strength: 2 })
          .exec();

        if (categoryExists) {
          res.redirect(categoryExists.url);
        } else {
          console.log(req.params.id);
          const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            category,
            {}
          );
          res.redirect(updatedCategory.url);
        }
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_get = async (req, res, next) => {
  try {
    const [category, allItemsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, 'name').exec(),
    ]);

    if (category === null) {
      res.redirect('/');
    }

    res.render('category_delete', {
      title: 'Delete Category',
      category: category,
      category_items: allItemsByCategory,
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete_post = async (req, res, next) => {
  try {
    const [category, allItemsByCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, 'name').exec(),
    ]);

    if (allItemsByCategory.isLength > 0) {
      res.resnder('category_delete', {
        title: 'Delete Category',
        category: category,
        category_items: allItemsByCategory,
      });
      return;
    } else {
      await Category.findByIdAndDelete(req.params.id);
      res.redirect('/');
    }
  } catch (err) {
    return next(err);
  }
};
