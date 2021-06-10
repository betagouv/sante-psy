import React, { useState } from 'react';

import Ariane from 'components/Ariane/Ariane';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Input from 'components/Form/Input';

import { REGIONS, DEPARTEMENTS } from 'services/geo';

const EditProfile = ({ psychologist, updatePsy, loading }) => {
  const [updatedPsychologist, setUpdatedPsychologist] = useState(psychologist);

  const save = e => {
    e.preventDefault();
    updatePsy(updatedPsychologist);
  };

  const changePsychologist = (value, field) => {
    setUpdatedPsychologist({ ...updatedPsychologist, [field]: value });
  };

  return (
    <>
      <Ariane
        previous={[
          {
            label: 'Mes informations',
            url: '/psychologue/mon-profil',
          }]}
        current="Modifier mes informations"
      />
      <h1>Modifier mes informations</h1>
      <GlobalNotification />
      {!loading && (
      <div className="fr-my-3w">
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
            data-test-id="psy-personal-email-input"
            value={updatedPsychologist.personalEmail}
            onChange={changePsychologist}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            placeholder="exemple@beta.gouv.fr"
            required
          />

          <h2>Informations pour l&lsquo;annuaire</h2>
          <Input
            label="Votre département"
            type="select"
            field="departement"
            data-test-id="psy-departement-select"
            value={updatedPsychologist.departement}
            onChange={changePsychologist}
            options={DEPARTEMENTS.map(departement => ({ id: departement, label: departement }))}
            required
          />
          <Input
            label="Votre région"
            type="select"
            field="region"
            data-test-id="psy-region-select"
            value={updatedPsychologist.region}
            onChange={changePsychologist}
            options={REGIONS.map(region => ({ id: region, label: region }))}
            required
          />
          <Input
            label="Adresse du cabinet"
            hint="Adresse où se rendre pour le rendez-vous."
            type="text"
            field="address"
            data-test-id="psy-address-input"
            value={updatedPsychologist.address}
            onChange={changePsychologist}
            required
          />
          <Input
            label="Téléphone du secrétariat"
            hint="Numéro auquel prendre rendez-vous."
            type="text"
            field="phone"
            data-test-id="psy-phone-input"
            value={updatedPsychologist.phone}
            onChange={changePsychologist}
            required
          />
          <Input
            label="Email de contact"
            hint="Adresse email à laquelle prendre rendez-vous ou poser des questions."
            type="text"
            field="email"
            data-test-id="psy-email-input"
            value={updatedPsychologist.email}
            onChange={changePsychologist}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            placeholder="exemple@beta.gouv.fr"
          />
          <Input
            type="radio"
            value={updatedPsychologist.teleconsultation}
            field="teleconsultation"
            onChange={changePsychologist}
            label="Proposez-vous de la téléconsultation ?"
            hint="Par téléphone ou par appel vidéo (Skype, Whatsapp, Teams, ...)"
            options={[
              {
                id: true,
                label: 'Oui',
              }, {
                id: false,
                label: 'Non',
              },
            ]}
            required
          />
          <Input
            label="Langues parlées"
            hint="Exemple : &ldquo;Français, Anglais&rdquo;"
            type="text"
            field="languages"
            data-test-id="psy-languages-input"
            value={updatedPsychologist.languages}
            onChange={changePsychologist}
            required
          />
          <Input
            label="Site web professionnel"
            hint="Site sur lequel l'étudiant pourra trouver plus d'info sur votre cabinet ou vos services."
            type="text"
            field="website"
            data-test-id="psy-website-input"
            value={updatedPsychologist.website}
            onChange={changePsychologist}
          />
          <Input
            label="Paragraphe de présentation"
            hint="Ex : &ldquo;Je propose du suivi pour les jeunes adultes, en particulier pour la gestion du stress et
            de l'anxiété.&rdquo;"
            type="textarea"
            field="description"
            data-test-id="psy-description-input"
            value={updatedPsychologist.description}
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
      </div>
      )}
    </>
  );
};

export default EditProfile;
