const express = require('express')
const router = new express.Router()
const Item = require('../item')

// GET /items - get all items
router.get('/', function(req,res,next){
  try {
    const items = Item.findAll()
    return res.json({ items })
  } catch(err) {
    return next(err)
  }
})

// POST /items - add a new item
router.post('/', function(req,res,next){
  try{
    const { name, price } = req.body
    if (!name || price === undefined){
      throw { message: 'Name and price are required', status: 400 }
    }
    const newItem = new Item(name, price)
    return res.status(201).json({ item: newItem })
  } catch(err){
    return next(err)
  }

})

// GET /items/:name - get a single item by name
router.get('/:name', function(req,res,next){
  try {
    const foundItem = Item.find(req.params.name)
    return res.json({ foundItem })
  } catch(err){
    return next(err)
  }
})

// PATCH /items/:name - update an item by name
router.patch('/:name', function(req,res,next){
  try {
    const foundItem = Item.update(req.params.name, req.body)
    return res.json({ item: foundItem })
  } catch(err) {
    return next(err)
  }
})

// DELETE /items/:name - delete an item by name
router.deleted('/:name', function(req,res, next){
  try {
    Item.remove(req.params.name)
    return res.json({ message: 'Deleted' })
  } catch(err) {
    return next(err)
  }
})

module.exports = router