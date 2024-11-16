const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'items.json');

class Item {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    Item.saveItem(this);
  }

  static readData() {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  static writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  }

  static findAll() {
    return this.readData();
  }

  static find(name) {
    const items = this.readData();
    const foundItem = items.find(item => item.name === name);
    if (!foundItem) {
      throw { message: 'Not Found', status: 404 };
    }
    return foundItem;
  }

  static saveItem(item) {
    const items = this.readData();
    items.push(item);
    this.writeData(items);
  }

  static update(name, data) {
    const items = this.readData();
    const itemIndex = items.findIndex(item => item.name === name);
    if (itemIndex === -1) {
      throw { message: 'Not Found', status: 404 };
    }
    if (data.name) items[itemIndex].name = data.name;
    if (data.price !== undefined) items[itemIndex].price = data.price;

    this.writeData(items);
    return items[itemIndex];
  }

  static remove(name) {
    let items = this.readData();
    const itemIndex = items.findIndex(item => item.name === name);
    if (itemIndex === -1) {
      throw { message: 'Not Found', status: 404 };
    }
    items.splice(itemIndex, 1);
    this.writeData(items);
  }
}

module.exports = Item;
