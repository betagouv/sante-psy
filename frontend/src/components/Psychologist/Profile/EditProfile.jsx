import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Ariane from 'components/Ariane/Ariane';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';
import Input from 'components/Form/Input';

import agent from 'services/agent';

import { useStore } from 'stores';

const EditProfile = () => {
  const { commonStore: { setNotification } } = useStore();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [psychologist, setPsychologist] = useState();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    agent.Psychologist.me().then(response => {
      if (response.success) {
        setPsychologist({ ...response.psychologist });
        setLoading(false);
      } else {
        history.goBack();
        setNotification(response);
      }
    });
  }, []);

  const save = e => {
    e.preventDefault();
    agent.Psychologist.update(psychologist).then(response => {
      if (response.success) {
        setShowForm(false);
      } else {
        window.scrollTo(0, 0);
      }
      setNotification(response);
    });
  };

  const changePsychologist = (value, field) => {
    setPsychologist({ ...psychologist, [field]: value });
  };

  const pageTitle = showForm ? 'Modifier mes informations' : 'Mes informations';

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w">
      { showForm && (
      <Ariane
        previous={[
          {
            label: 'Mes informations',
            url: '/psychologue/mon-profil',
          }]}
        current={pageTitle}
      />
      )}
      <h1>{pageTitle}</h1>
      <GlobalNotification />
      {!loading && (
      <div className="fr-my-3w">
        { showForm ? (
          <form data-test-id="edit-profile-form" onSubmit={save}>
            <p className="fr-text--sm fr-mb-1v">
              Les champs avec une astérisque (
              <span className="red-text">*</span>
              ) sont obligatoires.
            </p>
            <Input
              label="Email personnel"
              hint="Adresse non communiquée sur l'annuaire, utilisée uniquement pour la réception de mail provenant de
             Santé Psy Etudiant."
              type="text"
              field="personalEmail"
              value={psychologist.personalEmail}
              onChange={changePsychologist}
              pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
              placeholder="exemple@beta.gouv.fr"
              required
            />

            <h2>Informations pour l&lsquo;annuaire</h2>
            <Input
              label="Votre département"
              type="text"
              field="departement"
              value={psychologist.departement}
              onChange={changePsychologist}
              required
            />
            <Input
              label="Votre région"
              type="text"
              field="region"
              value={psychologist.region}
              onChange={changePsychologist}
              required
            />
            <Input
              label="Adresse du cabinet"
              hint="Adresse où se rendre pour le rendez-vous."
              type="text"
              field="address"
              value={psychologist.address}
              onChange={changePsychologist}
              required
            />
            <Input
              label="Téléphone du secrétariat"
              hint="Numéro auquel prendre rendez-vous."
              type="text"
              field="phone"
              value={psychologist.phone}
              onChange={changePsychologist}
              required
            />
            <Input
              label="Email de contact"
              hint="Adresse email à laquelle prendre rendez-vous ou poser des questions."
              type="text"
              field="email"
              value={psychologist.email}
              onChange={changePsychologist}
              pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
              placeholder="exemple@beta.gouv.fr"
            />
            <Input
              label="Je propose de la téléconsultation"
              hint="Par téléphone ou par appel vidéo (Skype, Whatsapp, Teams, ...)"
              type="checkbox"
              field="teleconsultation"
              value={psychologist.teleconsultation}
              onChange={changePsychologist}
            />
            <Input
              label="Langues parlées"
              hint="Si vous pouvez réaliser les séances dans plusieurs langues, vous pouvez l'indiquer ici."
              type="text"
              field="languages"
              value={psychologist.languages}
              onChange={changePsychologist}
              required
            />
            <Input
              label="Site web professionnel"
              hint="Site sur lequel l'étudiant pourra trouver plus d'info sur votre cabinet ou vos services."
              type="text"
              field="website"
              value={psychologist.website}
              onChange={changePsychologist}
            />
            <Input
              label="Paragraphe de présentation"
              hint="Si vous le désirez, quelques lignes pour présenter vos services aux étudiants."
              type="textarea"
              field="description"
              value={psychologist.description}
              onChange={changePsychologist}
            />
            <div className="fr-my-5w">
              <button
                data-test-id="save-profile-button"
                type="submit"
                className="fr-btn fr-btn--icon-left fr-fi-check-line"
              >
                Valider les modifications
              </button>
            </div>
          </form>
        ) : (
          <>
            <p data-test-id="personal-email-info">
              <b>Email personnel :</b>
              {' '}
              {psychologist.personalEmail}
            </p>
            <h2>Informations pour l&lsquo;annuaire</h2>
            <p className="fr-mb-1v">
              <b>Votre département :</b>
              {' '}
              {psychologist.departement}
            </p>
            <p className="fr-mb-1v">
              <b>Votre région :</b>
              {' '}
              {psychologist.region}
            </p>
            <p className="fr-mb-1v">
              <b>Adresse du cabinet :</b>
              {' '}
              {psychologist.address}
            </p>
            <p className="fr-mb-1v">
              <b>Téléphone du secrétariat :</b>
              {' '}
              {psychologist.phone}
            </p>
            <p className="fr-mb-1v">
              <b>Email de contact :</b>
              {' '}
              {psychologist.email}
            </p>
            <p className="fr-mb-1v">
              <b>Téléconsultation :</b>
              {' '}
              {psychologist.teleconsultation ? 'Oui' : 'Non'}
            </p>
            <p className="fr-mb-1v">
              <b>Langues parlées :</b>
              {' '}
              {psychologist.languages}
            </p>
            <p className="fr-mb-1v">
              <b>Site web professionnel :</b>
              {' '}
              {psychologist.website}
            </p>
            <p className="fr-mb-1v">
              <b>Paragraphe de présentation :</b>
              {' '}
              {psychologist.description}
            </p>
            <div className="fr-my-5w">
              <button
                data-test-id="show-profile-form-button"
                type="submit"
                className="fr-btn fr-btn--icon-left fr-fi-edit-line"
                onClick={() => { setShowForm(true); }}
              >
                Modifier mes informations
              </button>
            </div>
          </>
        )}
      </div>
      )}
      <Mail />
    </div>
  );
};

export default EditProfile;
