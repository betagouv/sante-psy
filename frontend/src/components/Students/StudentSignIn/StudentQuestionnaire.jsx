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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './studentQuestionnaire.cssmodule.scss';
import agent from 'services/agent';
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
    privacyHidden: true,
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
    label: 'École de commerce / management',
    value: 'business',
  },
  {
    label: "École d'ingénieur",
    value: 'engineer',
  },
  {
    label: 'Lycée (CPGE, BTS, autres formations)',
    value: 'highschool',
  },
  {
    label: 'Établissement de santé (IFSI, écoles paramédicales…)',
    value: 'health',
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
    label: 'Arts, lettres, langues',
    value: 'arts',
  },
  {
    label: 'Droit, économie, gestion',
    value: 'legal',
  },
  {
    label: 'Sciences humaines et sociales',
    value: 'sociology',
  },
  {
    label: 'Sciences, technologies',
    value: 'science',
  },
  {
    label: 'Santé - médical et paramédical',
    value: 'medical',
  },
  {
    label: 'Autre',
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
  const [universitySearch, setUniversitySearch] = useState('');
  const [showUnivList, setShowUnivList] = useState(false);
  // step 2
  const [studyLevel, setStudyLevel] = useState(null);
  const [studyField, setStudyField] = useState(null);
  const [studyFieldOther, setStudyFieldOther] = useState(null);
  // step 3
  const [gender, setGender] = useState(null);
  const [livingPostcode, setLivingPostcode] = useState('');
  // step 4
  const [notificationMethod, setNotificationMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const signIn = async () => {
    try {
      await agent.Student.signIn({
        firstNames,
        lastName,
        dateOfBirth,
        ine,
        email,
        acceptedCGUs: true,
        schoolType,
        selectedUniversity,
        otherSchoolType,
        schoolPostcode,
        studyLevel,
        studyField,
        studyFieldOther,
        gender,
        livingPostcode,
        phoneNumber,
        notificationsEmail: ['email', 'both'].includes(notificationMethod),
        notificationsSms: ['sms', 'both'].includes(notificationMethod),
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
    if (step === 4) {
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
    return !!schoolType && 
      schoolPostcode.length === 5 &&
      (schoolType === 'university' || !!otherSchoolType) && 
      (schoolType !== 'university' || !!selectedUniversity);
    }
    if (step === 2) {
      return !!studyLevel && !!studyField && (studyField !== 'other' || !!studyFieldOther);
    }
    if (step === 3) {
      return !!gender && livingPostcode.length === 5; ;
    }
    if (step === 4) {
      return (
        !!notificationMethod &&
        (notificationMethod === 'email' || 
          (phoneNumber?.length === 10 && phoneNumber.startsWith('0')))
      );
    }
    return false;
  }, [
    step,
    schoolType,
    studyLevel,
    acceptedCGUs,
    gender,
    notificationMethod,
    schoolPostcode,
    selectedUniversity,
    otherSchoolType,
    studyField,
    studyFieldOther,
    livingPostcode,
    phoneNumber,
  ]);

  return (
    <StudentSignInHeader>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{STEPS[step].title}</h2>
        {STEPS[step].privacyHidden && (
          <div className={styles.privacyBanner}>
            <span className="fr-icon--sm fr-icon-eye-off-line" aria-hidden="true" />
            <p className={styles.privacyText}>
              Les informations suivantes ne seront pas visibles par les psychologues
            </p>
          </div>
        )}
        <div className={styles.imageContainer}>
          <img
            src={`/images/studentSpace/questionnaire/${STEPS[step].png}.png`}
            alt=""
          />
        </div>
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
                  <span className="error" aria-hidden="true"> *</span>
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
            {schoolType && schoolType !== 'university' && (
              <TextInput
                required
                label="Nom de l'établissement"
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
            {studyField === 'other' && (
              <TextInput
                required
                label="Précisez :"
                value={studyFieldOther}
                onChange={e => setStudyFieldOther(e.target.value)}
              />
            )}
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
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 5) setLivingPostcode(value);
              }}
            />
          </>
        )}
        {step === 4 && (
          <>
            <RadioGroup
              name="notificationMethod"
              legend="Comment souhaites-tu être notifié des séances déclarées par les psychologues ?"
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
                hint="Numéro français à 10 chiffres, commençant par 0. Utilisé uniquement pour les notifications"
                value={phoneNumber}
                onChange={e => {
                  const number = e.target.value.replace(/\D/g, '');
                  if (number.length <= 10) setPhoneNumber(number);
                }}
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
