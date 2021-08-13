import React, { useEffect, useState } from 'react';
import { Button, RadioGroup, Radio, TextInput, SearchableSelect } from '@dataesr/react-dsfr';

import DEPARTEMENTS from 'services/departments';

const EditProfile = ({ psychologist, updatePsy }) => {
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
    <form data-test-id="edit-profile-form" onSubmit={save}>
      <p className="fr-text--sm fr-mb-3w">
        Les champs avec une astérisque (
        <span className="red-text">*</span>
        ) sont obligatoires.
      </p>
      <TextInput
        className="midlength-input"
        label="Email personnel"
        hint="Adresse non communiquée sur l'annuaire, utilisée uniquement pour la réception de mail provenant de
             Santé Psy Étudiant."
        data-test-id="psy-personal-email-input"
        value={updatedPsychologist.personalEmail}
        onChange={e => changePsychologist(e.target.value, 'personalEmail')}
        type="email"
        required
      />
      <SearchableSelect
        className="midlength-select"
        label="Votre département"
        field="departement"
        data-test-id="psy-departement-select"
        selected={updatedPsychologist.departement}
        onChange={e => { changePsychologist(e, 'departement'); }}
        options={DEPARTEMENTS.map(departement => ({ value: departement, label: departement }))}
        required
      />
      <TextInput
        className="midlength-input"
        label="Adresse du cabinet"
        hint="Adresse où se rendre pour le rendez-vous."
        data-test-id="psy-address-input"
        value={updatedPsychologist.address}
        onChange={e => changePsychologist(e.target.value, 'address')}
        required
      />
      <TextInput
        className="midlength-input"
        label="Téléphone du secrétariat"
        hint="Numéro auquel prendre rendez-vous."
        data-test-id="psy-phone-input"
        value={updatedPsychologist.phone}
        onChange={e => changePsychologist(e.target.value, 'phone')}
        required
      />
      <TextInput
        className="midlength-input"
        label="Email de contact"
        hint="Adresse email à laquelle prendre rendez-vous ou poser des questions."
        data-test-id="psy-email-input"
        value={updatedPsychologist.email}
        onChange={e => changePsychologist(e.target.value, 'email')}
        type="email"
      />
      <RadioGroup
        value={updatedPsychologist.teleconsultation ? 'true' : 'false'}
        onChange={value => changePsychologist(value, 'teleconsultation')}
        legend="Proposez-vous de la téléconsultation ?"
        hint="Par téléphone ou par appel vidéo (Skype, Whatsapp, Teams, ...)"
        required
        isInline
      >
        <Radio
          data-test-id="teleConsultation-true"
          label="Oui"
          value="true"
        />
        <Radio
          label="Non"
          value="false"
        />
      </RadioGroup>
      <TextInput
        className="midlength-input"
        label="Langues parlées"
        hint="Exemple : &ldquo;Français, Anglais&rdquo;"
        data-test-id="psy-languages-input"
        value={updatedPsychologist.languages}
        onChange={e => changePsychologist(e.target.value, 'languages')}
        required
      />
      <TextInput
        className="midlength-input"
        label="Site web professionnel"
        hint="Site sur lequel l'étudiant pourra trouver plus d'info sur votre cabinet ou vos services."
        data-test-id="psy-website-input"
        value={updatedPsychologist.website}
        onChange={e => changePsychologist(e.target.value, 'website')}
      />
      <TextInput
        className="midlength-input"
        textarea
        label="Paragraphe de présentation"
        hint="Ex : &ldquo;Je propose du suivi pour les jeunes adultes, en particulier pour la gestion du stress et
            de l'anxiété.&rdquo;"
        data-test-id="psy-description-input"
        value={updatedPsychologist.description}
        onChange={e => changePsychologist(e.target.value, 'description')}
      />
      <Button
        submit
        data-test-id="save-profile-button"
        className="fr-btn--icon-left fr-fi-check-line"
      >
        Valider les modifications
      </Button>
    </form>
  );
};

export default EditProfile;
