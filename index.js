const bodyParser = require("body-parser")
const express = require('express')
const path = require('path')
const flash = require('connect-flash');

const appName = `Chèques d'Accompagnement Psychologique`
const appDescription = 'Suivi psychologique pour les étudiants'
const appRepo = 'https://github.com/betagouv/cheque-psy'
const contactEmail = 'contact-cheques-psy@beta.gouv.fr'
const port = process.env.PORT || 8080

const psyLinstingController = require('./controllers/psyListingController');

const app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/static', express.static('static'))
app.use('/gouvfr', express.static(path.join(__dirname, 'node_modules/@gouvfr/all/dist')))
// For getting data from POST requests
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash());


// Populate some variables for all views
app.use(function(req, res, next){
  res.locals.appName = appName
  res.locals.appDescription = appDescription
  res.locals.appRepo = appRepo
  res.locals.page = req.url
  res.locals.contactEmail = contactEmail
  next()
})

// app.get('/', (req, res) => {
//   res.render('landing')
// })

app.get('/', (req, res) => {
  res.render('psyListing', psyLinstingController.getPsychologist)
})

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice')
})

module.exports = app.listen(port, () => {
  console.log(`${appName} listening at http://localhost:${port}`)
})