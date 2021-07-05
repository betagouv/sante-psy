import React, { useEffect, useState } from 'react';
import { Button, RadioGroup, Radio, TextInput } from '@dataesr/react-dsfr';

import Ariane from 'components/Ariane/Ariane';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Input from 'components/Form/Input';

import DEPARTEMENTS from 'services/departments';
import { __Field } from 'graphql';

const EditProfile = ({ psychologist, updatePsy, loading }) => {
  const [updatedPsychologist, setUpdatedPsychologist] = useState(psychologist);
  useEffect(() => { setUpdatedPsychologist(psychologist); }, [psychologist]);

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
          <TextInput
            label="Email personnel"
            hint="Adresse non communiquée sur l'annuaire, utilisée uniquement pour la réception de mail provenant de
             Santé Psy Etudiant."
            data-test-id="psy-personal-email-input"
            value={updatedPsychologist.personalEmail}
            onChange={e => changePsychologist(e.target.value, "personalEmail")}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            required
          />

          <h2>Informations pour l&lsquo;annuaire</h2>
          <Input
            label="Votre département"
            type="searchableSelect"
            field="departement"
            data-test-id="psy-departement-select"
            value={updatedPsychologist.departement}
            onChange={changePsychologist}
            options={DEPARTEMENTS.map(departement => ({ id: departement, label: departement }))}
            required
          />
          <TextInput
            label="Adresse du cabinet"
            hint="Adresse où se rendre pour le rendez-vous."
            data-test-id="psy-address-input"
            value={updatedPsychologist.address}
            onChange={e => changePsychologist(e.target.value, "address")}
            required
          />
          <TextInput
            label="Téléphone du secrétariat"
            hint="Numéro auquel prendre rendez-vous."
            data-test-id="psy-phone-input"
            value={updatedPsychologist.phone}
            onChange={e => changePsychologist(e.target.value, "phone")}
            required
          />
          <TextInput
            label="Email de contact"
            hint="Adresse email à laquelle prendre rendez-vous ou poser des questions."
            data-test-id="psy-email-input"
            value={updatedPsychologist.email}
            onChange={e => changePsychologist(e.target.value, "email")}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
          />
          <RadioGroup
            value={updatedPsychologist.teleconsultation}
            onChange={e => changePsychologist(e.target.value, "teleconsultation")}
            legend="Proposez-vous de la téléconsultation ?"
            hint="Par téléphone ou par appel vidéo (Skype, Whatsapp, Teams, ...)"
            required
          >
            <Radio
              label= 'Oui'
              value= "true"
            />
            <Radio
              label= 'Non'
              value= "false"
            />
          </RadioGroup>
          <TextInput
            label="Langues parlées"
            hint="Exemple : &ldquo;Français, Anglais&rdquo;"
            data-test-id="psy-languages-input"
            value={updatedPsychologist.languages}
            onChange={e => changePsychologist(e.target.value, "languages")}
            required
          />
          <TextInput
            label="Site web professionnel"
            hint="Site sur lequel l'étudiant pourra trouver plus d'info sur votre cabinet ou vos services."
            data-test-id="psy-website-input"
            value={updatedPsychologist.website}
            onChange={e => changePsychologist(e.target.value, "website")}
          />
          <TextInput
            textarea
            label="Paragraphe de présentation"
            hint="Ex : &ldquo;Je propose du suivi pour les jeunes adultes, en particulier pour la gestion du stress et
            de l'anxiété.&rdquo;"
            data-test-id="psy-description-input"
            value={updatedPsychologist.description}
            onChange={e => changePsychologist(e.target.value, "description")}
          />
          <div className="fr-my-5w">
            <Button
              submit
              data-test-id="save-profile-button"
              className="fr-btn--icon-left fr-fi-check-line"
            >
              Valider les modifications
            </Button>
          </div>
        </form>
      </div>
      )}
    </>
  );
};

export default EditProfile;
