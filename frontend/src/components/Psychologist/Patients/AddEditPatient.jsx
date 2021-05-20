import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Ariane from 'components/Ariane/Ariane';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';

import { useStore } from 'stores/';

import date from 'services/date';
import agent from 'services/agent';

const AddEditPatient = () => {
  const history = useHistory();
  const { commonStore: { config, setNotification } } = useStore();
  const { patientId } = useParams();

  const [patient, setPatient] = useState({
    INE: '',
    dateOfBirth: '',
    doctorAddress: '',
    doctorName: '',
    firstNames: '',
    hasPrescription: false,
    institutionName: '',
    isStudentStatusVerified: false,
    lastName: '',
  });

  useEffect(() => {
    if (patientId) {
      agent.Patient.getOne(patientId).then(response => {
        if (response.success) {
          setPatient({
            ...response.patient,
            dateOfBirth: response.patient.dateOfBirth
              ? date.toFormatDDMMYYYY(new Date(response.patient.dateOfBirth))
              : '',
          });
        } else {
          setNotification(response);
        }
      });
    }
  }, [patientId]);

  const changePatient = (field, value) => {
    setPatient({ ...patient, [field]: value });
  };

  const pageTitle = patientId ? 'Modifier un patient' : 'Nouveau patient';
  const intro = patientId
    ? 'Modifiez les informations de l\'étudiant.'
    : 'Déclarez un étudiant comme étant patient du dispositif Santé Psy Etudiants. Vous pourrez ensuite déclarer les séances réalisées avec ce patient.';

  const button = {
    icon: patientId ? 'fr-fi-check-line' : 'fr-fi-add-line',
    text: patientId ? 'Valider les modifications' : 'Ajouter le patient',
  };
  const save = e => {
    e.preventDefault();
    const action = patientId
      ? agent.Patient.update(patientId, patient)
      : agent.Patient.create(patient);
    action.then(response => {
      if (response.success) {
        history.push('/psychologue/mes-patients');
      } else {
        window.scrollTo(0, 0);
      }
      setNotification(response);
    });
  };
  return (
    <div className="fr-container fr-mb-3w">
      <Ariane
        previous={[
          {
            label: 'Gérer mes patients',
            url: '/psychologue/mes-patients',
          }]}
        current={pageTitle}
      />
      <h1>{pageTitle}</h1>
      <p className="fr-mb-2w">{intro}</p>
      <GlobalNotification />
      <div className="fr-my-3w">
        <form onSubmit={save}>
          <p className="fr-text--sm fr-mb-1v">
            Les champs avec une astérisque (
            <span className="red-text">*</span>
            ) sont obligatoires.
          </p>
          <p className="fr-text--sm fr-mb-1v">
            S&lsquo;il vous manque des champs non-obligatoires,
            vous pourrez y revenir plus tard pour compléter le dossier.
          </p>
          <div>
            <div className="fr-my-3w">
              <label className="fr-label" htmlFor="firstnames">
                Prénoms
                {' '}
                <span className="red-text">*</span>
              </label>
              <input
                onChange={e => { changePatient('firstNames', e.target.value); }}
                className="fr-input midlength-input"
                value={patient.firstNames}
                id="firtnames"
                type="text"
                required
              />
            </div>
            <div className="fr-my-3w">
              <label className="fr-label" htmlFor="lastname">
                Nom
                {' '}
                <span className="red-text">*</span>
              </label>
              <input
                onChange={e => { changePatient('lastName', e.target.value); }}
                className="fr-input midlength-input"
                value={patient.lastName}
                id="lastname"
                type="text"
                required
              />
            </div>

            <div className="fr-my-3w">
              <label className="fr-label" htmlFor="dateofbirth">
                Date de naissance (obligatoire uniquement pour vos patients enregistrés après le
                {' '}
                {config.dateOfBirthDeploymentDate}
                )
              </label>
              <div className="fr-hint-text" id="dateofbirth-help">
                Exemple : 25/01/1987
              </div>
              <input
                onChange={e => { changePatient('dateOfBirth', e.target.value); }}
                className="fr-input midlength-input"
                value={patient.dateOfBirth}
                type="text"
                id="dateofbirth"
                pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
                title="Format JJ/MM/AAAA, par exemple : 25/01/1987"
                placeholder="JJ/MM/AAAA"
              />
            </div>
            <div className="fr-my-3w">
              <label
                className="fr-label"
                htmlFor="institution"
                aria-describedby="institution-help"
              >
                Établissement scolaire de l&lsquo;étudiant
              </label>
              <div className="fr-hint-text" id="institution-help">
                Exemple : Université de Rennes ou ENSAE
              </div>
              <input
                onChange={e => { changePatient('institutionName', e.target.value); }}
                id="institution"
                className="fr-input midlength-input"
                value={patient.institutionName}
                type="text"
              />
            </div>
            <div className="fr-my-3w">
              <label
                className="fr-label"
                htmlFor="ine"
                aria-describedby="ine-help"
              >
                Numéro INE de l&lsquo;étudiant (optionnel)
              </label>
              <div className="fr-hint-text" id="ine-help">
                Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d&lsquo;étudiant.
              </div>
              <input
                onChange={e => { changePatient('INE', e.target.value); }}
                className="fr-input short-input"
                value={patient.INE}
                type="text"
                maxLength="11"
                size="11"
              />
            </div>
            <div className="fr-my-3w fr-checkbox-group">
              <input
                onChange={e => {
                  changePatient('isStudentStatusVerified', e.target.checked);
                }}
                id="isstudentstatusverified"
                type="checkbox"
                checked={patient.isStudentStatusVerified}
              />
              <label className="fr-label" htmlFor="isstudentstatusverified">
                J&lsquo;ai vérifié le statut étudiant de ce patient
                <span className="fr-hint-text">J&lsquo;ai vu sa carte d&lsquo;étudiant ou un autre justificatif</span>
              </label>
            </div>
            <div className="fr-my-3w fr-checkbox-group">
              <input
                onChange={e => { changePatient('hasPrescription', e.target.checked); }}
                id="hasprescription"
                type="checkbox"
                checked={patient.hasPrescription}
              />
              <label className="fr-label" htmlFor="hasprescription">
                J&lsquo;ai vérifié que les séances ont bien été prescrites
                par un médecin ou un Service de Santé Universitaire
                <span className="fr-hint-text">
                  L&lsquo;étudiant m&lsquo;a présenté une lettre ou ordonnance médicale
                </span>
              </label>
            </div>
            <div className="fr-my-3w">
              <label className="fr-label" htmlFor="doctorname" aria-describedby="doctorname-help">
                Médecin ou Service de Santé Universitaire qui a orienté ce patient
              </label>
              <div className="fr-hint-text" id="doctorname-help">
                Exemple : Annie Benahmou ou SSU Rennes 1
              </div>
              <input
                onChange={e => { changePatient('doctorName', e.target.value); }}
                id="doctorname"
                className="fr-input midlength-input"
                value={patient.doctorName}
                type="text"
              />
            </div>
            <div className="fr-my-3w">
              <label className="fr-label" htmlFor="doctoraddress" aria-describedby="doctoraddress-help">
                Ville et/ou code postal du médecin ou Service de Santé Universitaire
              </label>
              <div className="fr-hint-text" id="doctoraddress-help">
                Exemple : 97400 Saint-Denis
              </div>
              <input
                onChange={e => { changePatient('doctorAddress', e.target.value); }}
                id="doctoraddress"
                className="fr-input midlength-input"
                value={patient.doctorAddress}
                type="text"
              />
            </div>
          </div>
          <div className="fr-my-5w">
            <button
              type="submit"
              className="fr-btn fr-btn--icon-left button.icon"
            >
              {button.text}
            </button>
          </div>
        </form>
      </div>
      <Mail />
    </div>
  );
};

export default AddEditPatient;
