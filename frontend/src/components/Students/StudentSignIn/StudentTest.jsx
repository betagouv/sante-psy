import React, { useMemo, useState } from 'react';
import styles from './studentTest.cssmodule.scss';
import { Button, Radio, RadioGroup } from '@dataesr/react-dsfr';
import { Checkbox } from '@dataesr/react-dsfr';
import { ButtonGroup } from '@dataesr/react-dsfr';

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
    value: 'cpge',
    label: 'CPGE',
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
const StudentTest = () => {
  const [acceptedCGUs, setAcceptedCGUs] = useState(false);
  const [step, setStep] = useState(0);
  const [schoolType, setSchoolType] = useState(null);
  const [studyLevel, setStudyLevel] = useState(null);

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
      return !!schoolType;
    }
    if (step === 2) {
      return !!studyLevel;
    }
  }, [step, schoolType, studyLevel, acceptedCGUs]);

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
