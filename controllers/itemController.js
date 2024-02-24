const Item = require('../models/item');

exports.detail = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('category').exec();

    res.render('item_detail', {
      name: item.name,
      description: item.description,
      price: item.price,
      numberInStock: item.numberInStock,
      categoryName: item.category.name,
    });
  } catch (err) {
    return next(err);
  }
};
