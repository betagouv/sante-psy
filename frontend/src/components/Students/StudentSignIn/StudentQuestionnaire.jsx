import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  ButtonGroup,
  TextInput,
} from '@dataesr/react-dsfr';
import universities from 'src/utils/universities';
import { Link } from 'react-router-dom';
import styles from './studentTest.cssmodule.scss';
import { useLocation } from 'react-router-dom';
import agent from 'services/agent';
import { useNavigate } from 'react-router-dom';
import StudentSignInHeader from './StudentSignInHeader';

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
  {
    label: 'BAC+3',
    value: 'bac_plus_trois',
  },
  {
    label: 'BAC+4',
    value: 'bac_plus_quatre',
  },
  {
    label: 'BAC+5 et plus',
    value: 'bac_plus_cinq_et_plus',
  },
];

const STUDY_FIELDS = [
  {
    label: 'arts, lettres, langues',
    value: 'arts',
  },
  {
    label: 'droit, économie, gestion',
    value: 'legal',
  },
  {
    label: 'sciences humaines et sociales',
    value: 'sociology',
  },
  {
    label: 'sciences, technologies',
    value: 'science',
  },
  {
    label: 'santé - médical et paramédical',
    value: 'medical',
  },
  {
    label: 'autre',
    value: 'other',
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

const StudentQuestionnaire = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate('/inscription', { replace: true });
    }
  }, [location.state, navigate]);

  const { email, ine, firstNames, lastName, dateOfBirth } =
    location.state || {};

  const [step, setStep] = useState(0);

  // step 0
  const [acceptedCGUs, setAcceptedCGUs] = useState(false);
  // step 1
  const [schoolType, setSchoolType] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [otherSchoolType, setOtherSchoolType] = useState('');
  const [schoolPostcode, setSchoolPostcode] = useState('');
  // step 2
  const [studyLevel, setStudyLevel] = useState(null);
  const [studyField, setStudyField] = useState(null);
  // step 3
  const [gender, setGender] = useState(null);
  const [livingPostcode, setLivingPostcode] = useState('');
  // step 4
  const [howDidYouKnow, setHowDidYouKnow] = useState(null);
  const [otherHowDidYouKnow, setOtherHowDidYouKnow] = useState(null);
  // step 5
  const [notificationMethod, setNotificationMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [universitySearch, setUniversitySearch] = useState('');
  const [showUnivList, setShowUnivList] = useState(false);

  const signIn = async () => {
    try {
      await agent.Student.signIn({
        firstNames,
        lastName,
        dateOfBirth,
        ine,
        email,
      });
      navigate('/inscription/success');
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUniversities = useMemo(
    () =>
      universities
        .sort()
        .filter(univ =>
          univ.toLowerCase().includes(universitySearch.toLowerCase()),
        ),
    [universitySearch],
  );

  const onClickNext = () => {
    if (step === 5) {
      signIn();
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
      return (
        !!schoolType &&
        !!schoolPostcode &&
        (schoolType !== 'other' || !!otherSchoolType) &&
        (schoolType !== 'university' || !!selectedUniversity)
      );
    }
    if (step === 2) {
      return !!studyLevel && !!studyField;
    }
    if (step === 3) {
      return !!gender && !!livingPostcode;
    }
    if (step === 4) {
      return (
        !!howDidYouKnow && (howDidYouKnow !== 'other' || !!otherHowDidYouKnow)
      );
    }
    if (step === 5) {
      return (
        !!notificationMethod &&
        (notificationMethod === 'email' || !!phoneNumber)
      );
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
    studyField,
    livingPostcode,
    otherHowDidYouKnow,
    phoneNumber,
    selectedUniversity,
  ]);

  return (
    <StudentSignInHeader>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{STEPS[step].title}</h2>
        <img
          src={`/images/studentSpace/questionnaire/${STEPS[step].png}.png`}
          alt=""
          height={186}
          width={186}
        />
        {step === 0 && (
          <>
            <p>
              Pour en savoir plus sur ton espace, consulte la page suivante
              :{' '}
            </p>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to="/cgu"
              className="fr-btn"
            >
              Conditions Générales d’Utilisation
            </Link>
            <Checkbox
              label="J’ai lu et j’accepte les Conditions Générales d’Utilisation"
              onChange={e => setAcceptedCGUs(e.target.checked)}
              checked={acceptedCGUs}
            />
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
            {schoolType === 'university' && (
              <div className={`fr-select-group ${styles.universityContainer}`}>
                <label className="fr-label" htmlFor="university-input">
                  Université
                </label>
                <input
                  className="fr-input"
                  id="university-input"
                  value={universitySearch}
                  onChange={e => {
                    setUniversitySearch(e.target.value);
                    setSelectedUniversity('');
                    setShowUnivList(true);
                  }}
                  onFocus={() => setShowUnivList(true)}
                  onBlur={() => setTimeout(() => setShowUnivList(false), 150)}
                  placeholder="Tapez pour rechercher..."
                />
                {showUnivList && (
                  <ul className={styles.universityList}>
                    {filteredUniversities.length > 0 ? (
                      filteredUniversities.map(university => (
                        <li
                          key={university}
                          className={styles.universityItem}
                          role="option"
                          aria-selected={selectedUniversity}
                          onMouseDown={() => {
                            setSelectedUniversity(university);
                            setUniversitySearch(university);
                            setShowUnivList(false);
                          }}
                        >
                          {university}
                        </li>
                      ))
                    ) : (
                      <li className={styles.noResult}>Aucun résultat</li>
                    )}
                  </ul>
                )}
              </div>
            )}
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
              onChange={e => {
                const postcode = e.target.value.replace(/\D/g, '');
                if (postcode.length <= 5) setSchoolPostcode(postcode);
              }}
              className="short-input"
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
            <RadioGroup
              name="studyField"
              legend="Fillière suivie :"
              value={studyField}
              onChange={value => setStudyField(value)}
              required
            >
              {STUDY_FIELDS.map(({ label, value }) => (
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

            <TextInput
              required
              label="Où habites-tu ?"
              hint="Pour te proposer des psychologues près de chez toi"
              value={livingPostcode}
              onChange={e => setLivingPostcode(e.target.value)}
              type="number"
            />
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
            {howDidYouKnow === 'other' && (
              <TextInput
                required
                label="Autre : précisez"
                value={otherHowDidYouKnow}
                onChange={e => setOtherHowDidYouKnow(e.target.value)}
              />
            )}
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
            {notificationMethod !== 'email' && (
              <TextInput
                required
                label="Numéro de téléphone"
                hint="Utilisé uniquement pour les notifications"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
              />
            )}
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
    </StudentSignInHeader>
  );
};

export default StudentQuestionnaire;
