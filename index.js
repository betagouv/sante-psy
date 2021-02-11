require('dotenv').config();

const express = require('express')
const path = require('path')
const config = require('./utils/config');

const appName = `Santé Psy Étudiants`
const appDescription = 'Suivi psychologique pour les étudiants'
const appRepo = 'https://github.com/betagouv/cheque-psy'
const contactEmail = 'contact-santepsyetudiants@beta.gouv.fr'
const port = process.env.PORT || 8080

const app = express()
const landingController = require('./controllers/landingController');
const psyLinstingController = require('./controllers/psyListingController');

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/static', express.static('static'))
app.use('/gouvfr', express.static(
  path.join(__dirname, 'node_modules/@gouvfr/all/dist')))

// Populate some variables for all views
app.use(function populate(req, res, next){
  res.locals.appName = appName
  res.locals.appDescription = appDescription
  res.locals.appRepo = appRepo
  res.locals.page = req.url
  res.locals.contactEmail = contactEmail
  next()
})

app.get('/', landingController.getLanding)

app.get('/consulter-les-psychologues', psyLinstingController.getPsychologist)

app.get('/mentions-legales', (req, res) => {
  res.render('legalNotice')
})

module.exports = app.listen(port, () => {
  console.log(`${appName} listening at http://localhost:${port}`)
})