const chai = require('chai');
const dbDoctors = require('../../db/doctors')
const dbPatients = require('../../db/patients')

module.exports.getCsrfTokenHtml = function getCsrfToken(request) {
  return request.res.text.split('<input type="hidden" name="_csrf" value="')[1].split('">')[0];
}

module.exports.getCsrfTokenCookie = function getCsrfToken(request) {
  return request.headers['set-cookie'];
}


module.exports.makeDoctor = async function makeDoctor(psychologistId) {
  try {
    const firstNames = "Sigmund"
    const lastName = "Freud"
    const address = "7 Rue"
    const city = "Bordeaux"
    const postalCode = "33300"
    const phone = "0600000000"
    const doctor = await dbDoctors.insertDoctor(psychologistId, firstNames, lastName,address,city, postalCode, phone)
    // Check doctor is inserted
    console.log("doctor doctor", doctor)
    const createdDoctor = await dbDoctors.getDoctorByIdAndPsyId(doctor.id, doctor.psychologistId)
    console.log("createdDoctor", createdDoctor)
    chai.assert(!!createdDoctor)
    return doctor
  } catch (err) {
    console.error(err);
  }
}

module.exports.makePatient = async (psychologistId, doctorId) => {
  // Insert an appointment and a patient
  const patient = await dbPatients.insertPatient('Ada', 'Lovelace', '12345678901', psychologistId, doctorId)
  // Check patient is inserted
  const createdPatient = await dbPatients.getPatientById(patient.id, psychologistId)
  chai.assert(!!createdPatient)
  return patient
}