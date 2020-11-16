const path = require('path')
const express = require('express')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const handlebars = require('handlebars')
const layouts = require('handlebars-layouts')

// Initialize express
const app = express()

// Setup
app.engine('hbs', hbs.__express)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../../views/'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../../public')))
app.use('/mdbootstrap', express.static(path.join(__dirname, '../../node_modules/mdbootstrap')))

// Handlebars
require('./handlebars')(handlebars, layouts)

// Routes
require('../api/index')(app, handlebars)

app.listen(process.env.PORT, () => {
    console.log('Application is up and running on port ' + process.env.PORT + '.')
})