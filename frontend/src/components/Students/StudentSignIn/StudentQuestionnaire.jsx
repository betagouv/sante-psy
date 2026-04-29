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
];

const SCHOOL_TYPES = [
  {
    label: 'À l’université (y compris IUT / BUT / inspé)',
    value: 'university',
  },
  {
    label: 'Dans un grand établissement (type IEP, EHESS, INALCO…)',
    value: 'grandsEtablissements',
  },
    {
    label: 'En classe préparatoire aux grandes écoles (CPGE)',
    value: 'prepa',
  },
  {
    label: "En école d’ingénieur (y compris école d’ingénieur universitaire)",
    value: 'engineer',
  },
    {
    label: 'En section de technicien supérieur (STS, BTS)',
    value: 'technician',
  },
  {
    label: 'En école de commerce',
    value: 'business',
  },
    {
    label: 'En école artistique ou culturelle',
    value: 'art',
  },
  {
    label: 'En établissement de santé (IFSI, écoles paramédicales…)',
    value: 'health',
  },
  {
    label: 'Dans un autre type d’établissement',
    value: 'other',
  },
];

const STUDY_LEVELS = [
  {
    label: 'Capacité en droit, DAEU, remise à niveau',
    value: 'daeu',
  },
  {
    label: 'Bac + 1 (L1, CPGE1, BTS1, prépa intégrée 1e année…)',
    value: 'bac_plus_un',
  },
  {
    label: 'Bac +2 (L2, CPGE2, BTS2, prépa intégrée 2e année…)',
    value: 'bac_plus_deux',
  },
  {
    label: 'Bac + 3 (L3, 1e année école ingénieur / du cycle grande école, année de spécialisation post BTS…)',
    value: 'bac_plus_trois',
  },
  {
    label: 'Bac +4 (M1, 2e année école ingénieur / du cycle grande école…)',
    value: 'bac_plus_quatre',
  },
  {
    label: 'Bac +5 (M2, 3e année école ingénieur / du cycle grande école…)',
    value: 'bac_plus_cinq',
  },
  {
    label: 'Bac +6 et plus',
    value: 'bac_plus_six_et_plus',
  },
  {
    label: 'Diplôme universitaire (DU)',
    value: 'university_degree',
  },
  
];

const STUDY_FIELDS = [
  {
    label: 'Arts, lettres, langues',
    value: 'arts',
  },
  {
    label: 'Droit, économie, gestion, sciences politiques',
    value: 'legal',
  },
  {
    label: 'Sciences humaines et sociales',
    value: 'sociology',
  },
  {
    label: 'Sciences et technologies',
    value: 'science',
  },
  {
    label: 'Santé, médical et paramédical',
    value: 'medical',
  },
  {
    label: 'Sciences et Techniques des Activités physiques et sportives (STAPS)',
    value: 'staps',
  },
  {
    label: 'Autre',
    value: 'other',
  },
];

const GENDERS = [
  {
    label: 'Comme un homme',
    value: 'male',
  },
  {
    label: 'Comme une femme',
    value: 'female',
  },
  {
    label: 'Non binaire',
    value: 'non_binary',
  },
  {
    label: "D'une autre manière",
    value: 'other',
  },
  {
    label: "Je ne sais pas",
    value: 'unknown',
  },
  {
    label: 'Je préfère ne pas répondre',
    value: 'no_answer',
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
  const [schoolName, setSchoolName] = useState('');
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
        schoolName: selectedUniversity ? `Université ${selectedUniversity}` : schoolName,
        schoolPostcode,
        studyLevel,
        studyField,
        studyFieldOther,
        gender,
        livingPostcode,
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
    if (step === 3) {
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
      (schoolType === 'university' || !!schoolName) && 
      (schoolType !== 'university' || !!selectedUniversity);
    }
    if (step === 2) {
      return !!studyLevel && !!studyField && (studyField !== 'other' || !!studyFieldOther);
    }
    if (step === 3) {
      return !!gender && livingPostcode.length === 5; ;
    }
    return false;
  }, [
    step,
    schoolType,
    studyLevel,
    acceptedCGUs,
    gender,
    schoolPostcode,
    selectedUniversity,
    schoolName,
    studyField,
    studyFieldOther,
    livingPostcode,
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
              legend="Dans quel type d’établissement étudies-tu ?"
              hint="Si double cursus, mettre l’établissement principal"
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
                label="Quel est le nom de ton établissement ?"
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
              />
            )}
            <TextInput
              required
              label="Où se situe ton établissement ?"
              hint="Indique le code postal"
              placeholder='75001'
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
              legend="À quel niveau d’études t’es-tu inscrit cette année ?"
              hint="Si double cursus, mettre le plus haut niveau"
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
              legend="Quel est ton domaine d’études ?"
              hint="Si double cursus, mettre le domaine principal"
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
                label="Préciser le domaine d’études"
                value={studyFieldOther}
                onChange={e => setStudyFieldOther(e.target.value)}
              />
            )}
          </>
        )}
        {step === 3 && (
          <>
            <TextInput
              required
              label="Dans quelle zone géographique aimerais-tu consulter un psychologue ?"
              hint="Cela nous aide à mieux comprendre les besoins en psychologues selon les zones"
              value={livingPostcode}
              placeholder='75001'
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 5) setLivingPostcode(value);
              }}
            />
            <RadioGroup
              name="gender"
              legend="Comment t’identifies-tu ?"
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
        <ButtonGroup isInlineFrom="xs">
          <Button secondary disabled={step === 0} onClick={onClickPrev}>
            Retour
          </Button>
          <Button onClick={onClickNext} disabled={!isButtonEnabled}>
            {step < 3 ? 'Suivant' : "M'inscrire"}
          </Button>
        </ButtonGroup>
      </div>
    </StudentSignInHeader>
  );
};

export default StudentQuestionnaire;
