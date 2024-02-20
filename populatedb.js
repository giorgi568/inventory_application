#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function itemCreate(
  index,
  name,
  description,
  price,
  numberInStock,
  category
) {
  const item = new Item({
    name: name,
    description: description,
    price: price,
    numberInStock: numberInStock,
    category: category,
  });

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createCategories() {
  console.log('adding categories');
  await Promise.all([
    categoryCreate(
      0,
      'Cutlery',
      'This category is for cutlery, such as spoon, fork, ect.'
    ),
    categoryCreate(1, 'Balls', 'This category is for balls.'),
    categoryCreate(
      2,
      'Clothes',
      'This category is for different kinds of clothes'
    ),
    categoryCreate(
      3,
      'Flowers',
      'This category is for different kinds of flowers.'
    ),
  ]);
}

async function createItems() {
  console.log('adding items');
  await Promise.all([
    itemCreate(0, 'Fork', 'Normal fork.', 4.99, 124, categories[0]),
    itemCreate(1, 'Knife', 'Regular knife', 7.5, 32, categories[0]),
    itemCreate(2, 'Spoon', 'Stainless steel spoon', 4.99, 52, categories[0]),
    itemCreate(
      3,
      'Football',
      'Champions League Football',
      52.5,
      6,
      categories[1]
    ),
    itemCreate(
      4,
      'Tennis ball',
      'Standard tennis ball',
      10,
      24,
      categories[1]
    ),
    itemCreate(5, 'Jacket', 'Leather Jacket', 42.99, 1, categories[2]),
    itemCreate(6, 'Trousers', 'Black trousers', 49, 3, categories[2]),
    itemCreate(7, 'Tank Top', 'White Tank Top', 7, 89, categories[2]),
    itemCreate(8, 'Lilies', 'Beautifull lilies', 3.1, 4, categories[3]),
    itemCreate(9, 'Rose', 'Red rose', 5, 1000000, categories[3]),
  ]);
}
