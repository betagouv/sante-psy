import React, { useEffect, useState } from 'react';
import { Input } from '@codegouvfr/react-dsfr/Input';
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons';
import { ButtonsGroup } from '@codegouvfr/react-dsfr/ButtonsGroup';
import { useLocation, useNavigate } from 'react-router-dom';
import agent from 'services/agent';
import string from 'services/string';
import { useStore } from 'stores/index';
import styles from './psySection.cssmodule.scss';
import AddressAutocomplete from 'components/AddressAutocomplete/AddressAutocomplete';

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    commonStore: { setPsychologists, setNotification },
  } = useStore();
  const [psychologist, setPsychologist] = useState(
    location.state?.psychologist || {
      personalEmail: '',
      address: '',
      otherAddress: '',
      phone: '',
      email: '',
      teleconsultation: false,
      languages: '',
      website: '',
      appointmentLink: '',
      description: '',
    },
  );
  const [newAddress, setNewAddress] = useState(null);
  const [newOtherAddress, setNewOtherAddress] = useState(null);
  const [isLoaded, setIsLoaded] = useState(!!location.state?.psychologist);

  useEffect(() => {
    const loadPsychologist = async () => {
      try {
        const response = await agent.Psychologist.getProfile();
        setPsychologist(response);
        setIsLoaded(true);
      } catch (error) {
        setNotification({ type: 'error', message: error.response.data });
      }
    };

    if (!isLoaded) {
      loadPsychologist();
    }
  }, [isLoaded]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const updatePsy = {
        personalEmail: psychologist.personalEmail,
        email: psychologist.email,
        phone: psychologist.phone,
        teleconsultation: psychologist.teleconsultation,
        languages: psychologist.languages,
        website: psychologist.website,
        appointmentLink: psychologist.appointmentLink,
        description: psychologist.description,
        ...(!!newAddress && { address: newAddress }),
        ...(!!newOtherAddress && { otherAddress: newOtherAddress }),
      };
      const response = await agent.Psychologist.updateProfile(updatePsy);
      updatePsyList();
      navigate('/psychologue/tableau-de-bord', {
        state: { notification: response },
      });
    } catch (error) {
      setNotification({ type: 'error', message: error.response.data });
    }
  };

  const updatePsyList = () => {
    agent.Psychologist.find().then(setPsychologists);
  };

  const changePsychologist = (value, field) => {
    setPsychologist((prev) => ({ ...prev, [field]: value }));
  };

  const enrichWebsite = () => {
    const prefixedWebsite = string.prefixUrl(psychologist.website);
    if (prefixedWebsite) {
      changePsychologist(prefixedWebsite, 'website');
    }
  };

  const enrichAppointmentLink = () => {
    const prefixedAppointmentLink = string.prefixUrl(
      psychologist.appointmentLink,
    );
    if (prefixedAppointmentLink) {
      changePsychologist(prefixedAppointmentLink, 'appointmentLink');
    }
  };

  const handleAddress = (value, setAddress) => {
    if (typeof value === 'object' && value !== null) {
      const { city, postcode, context, label, coordinates } = value;
      const splitContext = context.split(',').map((item) => item.trim());
      const [numDep, labelDepartement, region] = splitContext;
      const departement = `${numDep} - ${labelDepartement}`;
      const [longitude, latitude] = coordinates;

      if (city && postcode && label && departement && longitude && latitude) {
        setAddress({
          city,
          postcode,
          address: label,
          departement,
          region: region || '',
          longitude,
          latitude,
        });
      }
    } else {
      setAddress(null);
    }
  };

  const handleNewAddress = (value) => handleAddress(value, setNewAddress);
  const handleNewOtherAddress = (value) =>
    handleAddress(value, setNewOtherAddress);

  return (
    isLoaded && (
      <form data-test-id="edit-profile-form" onSubmit={save}>
        <p className="fr-text--sm fr-mb-3w">
          Les champs avec une astérisque (<span className="red-text">*</span>)
          sont obligatoires.
        </p>
        <Input
          className="midlength-input"
          label="Email personnel"
          hintText="Adresse non communiquée sur l'annuaire, utilisée uniquement pour la réception d'email provenant de
             Santé Psy Étudiant."
          nativeInputProps={{
            'data-test-id': 'psy-personal-email-input',
            value: psychologist.personalEmail,
            onChange: (e) =>
              changePsychologist(e.target.value, 'personalEmail'),
            type: 'email',
            required: true,
          }}
        />
        <AddressAutocomplete
          label="Adresse du cabinet"
          hint="Adresse où se rendre pour le rendez-vous."
          aroundMe={false}
          className="midlength-input fr-input-group"
          selected={psychologist.address}
          onChange={handleNewAddress}
          isMunicipalities={false}
          required
        />
        <AddressAutocomplete
          label="Autre adresse du cabinet"
          hint="Si vous avez un deuxième cabinet vous pouvez indiquer son adresse ici"
          aroundMe={false}
          className="midlength-input fr-input-group"
          selected={psychologist.otherAddress}
          onChange={handleNewOtherAddress}
          isMunicipalities={false}
        />
        <Input
          className="midlength-input"
          label="Téléphone du secrétariat"
          hintText="Numéro auquel prendre rendez-vous."
          nativeInputProps={{
            'data-test-id': 'psy-phone-input',
            value: psychologist.phone,
            onChange: (e) => changePsychologist(e.target.value, 'phone'),
            required: true,
          }}
        />

        <Input
          className="midlength-input"
          label="Email de contact"
          hintText="Adresse email à laquelle prendre rendez-vous ou poser des questions."
          nativeInputProps={{
            'data-test-id': 'psy-email-input',
            value: psychologist.email,
            onChange: (e) => changePsychologist(e.target.value, 'email'),
            type: 'email',
          }}
        />

        <RadioButtons
          legend="Proposez-vous de la téléconsultation ?"
          hintText="Par téléphone ou par appel vidéo (Skype, Whatsapp, Teams, ...)"
          orientation="horizontal"
          options={[
            {
              label: 'Oui',
              nativeInputProps: {
                value: 'true',
                checked: psychologist.teleconsultation === true,
                required: true,
                onChange: (e) =>
                  changePsychologist(e.target.value, 'teleconsultation'),
                'data-test-id': 'teleConsultation-true',
              },
            },
            {
              label: 'Non',
              nativeInputProps: {
                value: 'false',
                checked: psychologist.teleconsultation === false,
                required: true,
                onChange: (e) =>
                  changePsychologist(e.target.value, 'teleconsultation'),
              },
            },
          ]}
        />
        <Input
          className="midlength-input"
          label="Langues parlées"
          hintText="Exemple : “Français, Anglais”"
          nativeInputProps={{
            'data-test-id': 'psy-languages-input',
            value: psychologist.languages,
            onChange: (e) => changePsychologist(e.target.value, 'languages'),
            required: true,
          }}
        />

        <Input
          className="midlength-input"
          label="Site web professionnel"
          hintText="Site sur lequel l'étudiant pourra trouver plus d'infos sur votre cabinet ou vos services."
          nativeInputProps={{
            'data-test-id': 'psy-website-input',
            value: psychologist.website,
            onChange: (e) => changePsychologist(e.target.value, 'website'),
            onBlur: enrichWebsite,
          }}
        />

        <Input
          className="midlength-input"
          label="Site web pour prendre rendez-vous"
          hintText="Site sur lequel l'étudiant pourra prendre rendez-vous avec vous."
          nativeInputProps={{
            'data-test-id': 'psy-appointmentLink-input',
            value: psychologist.appointmentLink,
            onChange: (e) =>
              changePsychologist(e.target.value, 'appointmentLink'),
            onBlur: enrichAppointmentLink,
          }}
        />

        <div className={`fr-input-group ${styles.descriptionInput}`}>
          <label className="fr-label" htmlFor="psy-description-input">
            Paragraphe de présentation
            <span className="fr-hint-text">
              Ex : &ldquo;Je propose du suivi pour les jeunes adultes, en
              particulier pour la gestion du stress et de l'anxiété.&rdquo;
            </span>
          </label>
          <textarea
            className="fr-input"
            id="psy-description-input"
            data-test-id="psy-description-input"
            value={psychologist.description}
            onChange={(e) => changePsychologist(e.target.value, 'description')}
          />
        </div>
        <ButtonsGroup
          inlineLayoutWhen="always"
          buttons={[
            {
              children: 'Valider les modifications',
              iconId: 'fr-icon-check-line',
              iconPosition: 'left',
              nativeButtonProps: {
                type: 'submit',
                'data-test-id': 'save-profile-button',
              },
            },
            {
              children: 'Annuler',
              priority: 'secondary',
              iconId: 'fr-icon-close-line',
              iconPosition: 'left',
              onClick: () => navigate('/psychologue/tableau-de-bord/'),
            },
          ]}
        />
      </form>
    )
  );
};

export default EditProfile;
