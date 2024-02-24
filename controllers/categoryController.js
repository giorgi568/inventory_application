const Category = require('../models/category');

exports.index = async (req, res, next) => {
  try {
    const [numCategory, categories] = await Promise.all([
      Category.countDocuments({}).exec(),
      Category.find({}).exec(),
    ]);
    
    res.render('index', {
      category_count: numCategory,
      categories: categories,
      title: 'Inventory Application'
    })
  } catch(err) {
    return next(err)
  }
};
