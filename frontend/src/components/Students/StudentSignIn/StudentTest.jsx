import React, { useMemo, useState } from 'react';
import styles from './studentTest.cssmodule.scss';
import { Button, Radio, RadioGroup } from '@dataesr/react-dsfr';
import { Checkbox } from '@dataesr/react-dsfr';
import { ButtonGroup } from '@dataesr/react-dsfr';
import { TextInput } from '@dataesr/react-dsfr';

const STEPS = [
  {
    title: 'Conditions d’utilisation',
    png: 'image_284',
  },
  {
    title: 'Tes études',
    png: 'image_277',
  },
  {
    title: 'Tes études',
    png: 'image_278',
  },
  {
    title: 'Mieux te connaître',
    png: 'image_260',
  },
  {
    title: 'Mieux te connaître',
    png: 'image_280',
  },
  {
    title: 'Notifications',
    png: 'image_298',
  },
];

const SCHOOL_TYPES = [
  {
    value: 'university',
    label: 'Université',
  },
  {
    label: 'Ecole de commerce / compta / gestion / vente',
    value: 'school',
  },
  {
    label: 'Formation ingénieur',
    value: 'engineer',
  },
  {
    label: 'SST',
    value: 'sst',
  },
  {
    label: 'CPGE',
    value: 'cpge',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

const STUDY_LEVELS = [
  {
    label: 'BAC+1',
    value: 'bac_plus_un',
  },
  {
    label: 'BAC+2',
    value: 'bac_plus_deux',
  },
];

const GENDERS = [
  {
    label: 'Homme',
    value: 'male',
  },
  {
    label: 'Femme',
    value: 'female',
  },
  {
    label: 'Non binaire',
    value: 'non_binary',
  },
  {
    label: 'Je ne préfère pas répondre',
    value: 'no_answer',
  },
];

const HOW_DID_YOU_KNOW = [
  {
    label: 'Réseaux sociaux',
    value: 'social_network',
  },
  {
    label: 'Internet',
    value: 'internet',
  },
  {
    label: 'Mon école',
    value: 'school',
  },
  {
    label: 'Médias',
    value: 'media',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

const NOTIFICATION_METHODS = [
  {
    label: 'email',
    value: 'email',
  },
  {
    label: 'SMS',
    value: 'sms',
  },
  {
    label: 'email + SMS',
    value: 'both',
  },
];

const StudentTest = () => {
  const [step, setStep] = useState(0);

  // step 0
  const [acceptedCGUs, setAcceptedCGUs] = useState(false);
  // step 1
  const [schoolType, setSchoolType] = useState(null);
  const [otherSchoolType, setOtherSchoolType] = useState('');
  const [schoolPostcode, setSchoolPostcode] = useState('');
  // step 2
  const [studyLevel, setStudyLevel] = useState(null);
  //step 3
  const [gender, setGender] = useState(null);
  //step 4
  const [howDidYouKnow, setHowDidYouKnow] = useState(null);
  //step 5
  const [notificationMethod, setNotificationMethod] = useState(null);

  const onClickNext = () => {
    if (step === 5) {
      console.log('inscription');
      return;
    }
    setStep(prev => prev + 1);
  };

  const onClickPrev = () => {
    setStep(prev => prev - 1);
  };

  const isButtonEnabled = useMemo(() => {
    if (step === 0) {
      return !!acceptedCGUs;
    }
    if (step === 1) {
      return !!schoolType && !!schoolPostcode && schoolType === 'other' && !!otherSchoolType;
    }
    if (step === 2) {
      return !!studyLevel;
    }
    if (step === 3) {
      return !!gender;
    }
    if (step === 4) {
      return !!howDidYouKnow;
    }
    if (step === 5) {
      return !!notificationMethod;
    }
  }, [
    step,
    schoolType,
    studyLevel,
    acceptedCGUs,
    gender,
    howDidYouKnow,
    notificationMethod,
    schoolPostcode,
    otherSchoolType,
  ]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{STEPS[step].title}</h2>
      <img src={`/images/studentSpace/questionnaire/${STEPS[step].png}.png`} alt="" height={186} width={186} />
      {step === 0 && (
        <>
          <p>Pour en savoir plus sur ton espace, consulte la page suivante : </p>
          <Button secondary>Conditions Générales d’Utilisation</Button>
          <Checkbox
            label="J’ai lu et j’accepte les Conditions Générales d’Utilisation"
            onChange={e => setAcceptedCGUs(e.target.checked)}
            checked={acceptedCGUs}
            className={styles.checkbox}
          ></Checkbox>
        </>
      )}
      {step === 1 && (
        <>
          <RadioGroup
            name="schoolType"
            legend="Type d'établissement :"
            value={schoolType}
            onChange={value => setSchoolType(value)}
            required
          >
            {SCHOOL_TYPES.map(({ value, label }) => (
              <Radio key={value} label={label} value={value} />
            ))}
          </RadioGroup>
          {schoolType === 'other' && (
            <TextInput
              required
              label="Autre : précisez"
              value={otherSchoolType}
              onChange={e => setOtherSchoolType(e.target.value)}
            />
          )}
          <TextInput
            required
            label="Code postal de l'établissement"
            value={schoolPostcode}
            onChange={e => setSchoolPostcode(e.target.value)}
            type="number"
          />
        </>
      )}
      {step === 2 && (
        <>
          <RadioGroup
            name="studyLevel"
            legend="Niveau d’études suivi :"
            value={studyLevel}
            onChange={value => setStudyLevel(value)}
            required
          >
            {STUDY_LEVELS.map(({ label, value }) => (
              <Radio key={value} label={label} value={value} />
            ))}
          </RadioGroup>
        </>
      )}
      {step === 3 && (
        <>
          <RadioGroup
            name="gender"
            legend="Comment te définis-tu ?"
            value={gender}
            onChange={value => setGender(value)}
            required
          >
            {GENDERS.map(({ label, value }) => (
              <Radio key={value} label={label} value={value} />
            ))}
          </RadioGroup>
        </>
      )}
      {step === 4 && (
        <>
          <RadioGroup
            name="howDidYouKnow"
            legend="Comment as-tu connu Santé Psy Étudiant ?"
            value={howDidYouKnow}
            onChange={value => setHowDidYouKnow(value)}
            required
          >
            {HOW_DID_YOU_KNOW.map(({ label, value }) => (
              <Radio key={value} label={label} value={value} />
            ))}
          </RadioGroup>
        </>
      )}
      {step === 5 && (
        <>
          <RadioGroup
            name="notificationMethod"
            legend="Comment souhaites-tu être notifé des séances déclarées par les psychologues ?"
            value={notificationMethod}
            onChange={value => setNotificationMethod(value)}
            required
          >
            {NOTIFICATION_METHODS.map(({ label, value }) => (
              <Radio key={value} label={label} value={value} />
            ))}
          </RadioGroup>
        </>
      )}
      <ButtonGroup isInlineFrom="xs">
        <Button secondary disabled={step === 0} onClick={onClickPrev}>
          Retour
        </Button>
        <Button onClick={onClickNext} disabled={!isButtonEnabled}>
          {step < 5 ? 'Suivant' : "M'inscrire"}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default StudentTest;
