const cookie = require('../utils/cookie');
const config = require('../utils/config');
const date = require('../utils/date');
const dbPsycologist = require('../db/psychologists')

const DOCTOR_NAME = 'nom du docteur';
const INSTITUTION_NAME = 'établissement scolaire';
const DOCTOR_ADDRESS = 'adresse du docteur';
const BIRTH_DATE = 'date de naissance';
const STUDENT_STATUS = 'statut étudiant';
const PRESCRIPTION = 'orientation médicale';

module.exports.profil = async function profil(req, res) {
    try {
        const psychologistId = cookie.getCurrentPsyId(req);
        const psychologist = await dbPsycologist.getAcceptedPsychologistByEmail(psychologistId)
        return res.render('myProfil', {
            psychologist
        })
    } catch (err) {
        req.flash('error', 'Impossible de charger votre profil, Réessayez ultérieurement');
        console.error('profil', err);
        res.render('profil', {
            profil: []
        })
    }
}