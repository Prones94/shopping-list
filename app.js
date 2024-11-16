const express = require('express')
const ExpressError = require('./expressError')
const itemsRoutes = require('./routes/items')
const app = express()
const port = 3000

app.use(express.json())
app.use('/items', itemsRoutes)

app.use((req,res,next) => {
  const err = new ExpressError('Not Found', 404)
  return next(err)
})

app.use((err, req,res,next) => {
  res.status(err.status || 500)
  return res.json({
    error: err.message
  })
})

app.listen(port, function(){
  console.log(`Server is running on port ${port}`);
})

module.exports = app