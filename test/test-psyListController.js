/* eslint-disable func-names */
const app = require('../index')
const chai = require('chai')
const rewire = require('rewire')
const psyListController = rewire('../controllers/psyListingController');
describe('psyListController', function() {
  describe('getCityAndPostalCode', function() {
    const getCityAndPostalCode = psyListController.__get__('getCityAndPostalCode');

    
    it('extract city and postal code from address', async function() {
      const normalCase1 =  "17 Rue Volta 92800 Puteaux"
      const normalCase2 =  "CHP Saint Grégoire 10 Boulevard de la Boutière 35760 Saint-Grégoire"

      getCityAndPostalCode(normalCase1).should.equal("92800 Puteaux")
      getCityAndPostalCode(normalCase2).should.equal("35760 Saint-Grégoire")
    })

    it('should process weird cases', function() {
      const weirdCases = [
        "Rue des peupliers, Montchat, Lyon 03",
        "315 Avenue Frédéric Sabatier d’Espeyran 34090 Montpellier. Le Clos du mail, escalier À, Bat. I",
        "22 RUE EDMEE GUILLOU",
        "39 rue Saint Fargeau - Escalier D - 5ème étage droite droite - 75020",
        "Haute Corse (plusieurs adresses)",
        "appel vidéo (Skype)",
      ]

      getCityAndPostalCode(weirdCases[0]).should.equal("error")
      getCityAndPostalCode(weirdCases[1]).should.equal("34090 Montpellier")
      getCityAndPostalCode(weirdCases[2]).should.equal("error")
      getCityAndPostalCode(weirdCases[3]).should.equal("error")
      getCityAndPostalCode(weirdCases[4]).should.equal("error")
      getCityAndPostalCode(weirdCases[5]).should.equal("error")
    })
  })
})