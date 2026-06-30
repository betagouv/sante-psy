import React, { useEffect, useState } from 'react';
import {
  Button,
  RadioGroup,
  Radio,
  TextInput,
  SearchableSelect,
  ButtonGroup,
} from '@dataesr/react-dsfr';
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
        <TextInput
          className="midlength-input"
          label="Email personnel"
          hint="Adresse non communiquée sur l'annuaire, utilisée uniquement pour la réception d'email provenant de
             Santé Psy Étudiant."
          data-test-id="psy-personal-email-input"
          value={psychologist.personalEmail}
          onChange={(e) => changePsychologist(e.target.value, 'personalEmail')}
          type="email"
          required
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
        <TextInput
          className="midlength-input"
          label="Téléphone du secrétariat"
          hint="Numéro auquel prendre rendez-vous."
          data-test-id="psy-phone-input"
          value={psychologist.phone}
          onChange={(e) => changePsychologist(e.target.value, 'phone')}
          required
        />
        <TextInput
          className="midlength-input"
          label="Email de contact"
          hint="Adresse email à laquelle prendre rendez-vous ou poser des questions."
          data-test-id="psy-email-input"
          value={psychologist.email}
          onChange={(e) => changePsychologist(e.target.value, 'email')}
          type="email"
        />
        <RadioGroup
          value={psychologist.teleconsultation ? 'true' : 'false'}
          onChange={(value) => changePsychologist(value, 'teleconsultation')}
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
          <Radio label="Non" value="false" />
        </RadioGroup>
        <TextInput
          className="midlength-input"
          label="Langues parlées"
          hint="Exemple : “Français, Anglais”"
          data-test-id="psy-languages-input"
          value={psychologist.languages}
          onChange={(e) => changePsychologist(e.target.value, 'languages')}
          required
        />
        <TextInput
          className="midlength-input"
          label="Site web professionnel"
          hint="Site sur lequel l'étudiant pourra trouver plus d'infos sur votre cabinet ou vos services."
          data-test-id="psy-website-input"
          value={psychologist.website}
          onChange={(e) => changePsychologist(e.target.value, 'website')}
          onBlur={enrichWebsite}
        />
        <TextInput
          className="midlength-input"
          label="Site web pour prendre rendez-vous"
          hint="Site sur lequel l'étudiant pourra prendre rendez-vous avec vous."
          data-test-id="psy-appointmentLink-input"
          value={psychologist.appointmentLink}
          onChange={(e) =>
            changePsychologist(e.target.value, 'appointmentLink')
          }
          onBlur={enrichAppointmentLink}
        />
        <TextInput
          className={styles.descriptionInput}
          id="psy-description-input"
          textarea
          label="Paragraphe de présentation"
          hint="Ex : &ldquo;Je propose du suivi pour les jeunes adultes, en particulier pour la gestion du stress et
            de l'anxiété.&rdquo;"
          data-test-id="psy-description-input"
          value={psychologist.description}
          onChange={(e) => changePsychologist(e.target.value, 'description')}
        />
        <ButtonGroup isInlineFrom="xs">
          <Button
            submit
            data-test-id="save-profile-button"
            icon="fr-fi-check-line"
          >
            Valider les modifications
          </Button>
          <Button
            onClick={() => navigate('/psychologue/tableau-de-bord/')}
            secondary
            icon="fr-fi-close-line"
          >
            Annuler
          </Button>
        </ButtonGroup>
      </form>
    )
  );
};

export default EditProfile;
