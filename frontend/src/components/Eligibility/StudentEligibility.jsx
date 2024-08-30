import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, TextInput, Icon, SearchableSelect } from '@dataesr/react-dsfr';
import Page from 'components/Page/Page';
import classNames from 'classnames';
import eligibleSchools from '../../utils/eligibleSchools.ts';
import styles from './studentEligibility.cssmodule.scss';

const StudentEligibility = () => {
  const [INE, setINE] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showEligibility, setShowEligibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedEligibleSchool, setSelectedEligibleSchool] = useState(false);

  const handleSelectedEligibleSchool = selectedSchool => {
    setSelectedEligibleSchool(selectedSchool);
    setIsEligible(selectedSchool);
  };

  const validateINE = (ine) => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'checkEligibility']);
    }
    
    const errors = [];
    
    if (!ine) {
      errors.push('Vous devez spécifier un numéro INE.');
    }
    if (!/^[a-zA-Z0-9]{11}$/.test(ine)) {
      errors.push('Le numéro INE doit être composé de 11 caractères alphanumériques (chiffres ou lettres sans accents).');
    }
  
    return errors;
  };

  const submit = e => {
    e.preventDefault();
    setIsLoading(true);
    
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'checkEligibility']);
    }

    const errors = validateINE(INE);
    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
      setError(true);
      setIsLoading(false);
      return;
    } else {
      setShowEligibility(true);
      setIsEligible(true);
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'nextStepEligibility']);
    }
    navigate('/#anchor-psy-list');
  };

  const onChange = ine => {
    setError(false);
    setErrorMessage('');
    setShowEligibility(false);
    setIsEligible(false);
    setINE(ine);
    setIsLoading(false);
  };

  const eligibilityMessage = () => {
    if (isEligible) {
      return (
        <div
          className={classNames(
            styles.eligibilityMessage,
            styles.eligibilityMessage_valid,
          )}
        >
          <Icon
            name="ri-checkbox-circle-fill"
            size="lg"
            color="#18753c"
            iconPosition="left"
          >
            <p>Vous êtes éligible au dispositif. 
              Attention, lors de votre 1re consultation, le psychologue vérifiera votre carte étudiante ou certificat de scolarité en cours de validité pour l'année en cours.</p>
          </Icon>
        </div>
      );
    }
  };

  return (
    <Page
      breadCrumbs={[{ href: '/', label: 'Accueil' }]}
      currentBreadCrumb="Éligibilité"
      title={<>Éligibilité</>}
      description={<>Vous êtes étudiant, vérifiez que vous êtes éligible</>}
      className={styles.page}
    >
      <form onSubmit={submit}>
        <div className={styles.formContainer}>
          <p>
            Le dispositif Santé Psy Étudiant est accessible à tous les étudiants
            inscrits dans un établissement d&apos;enseignement supérieur
            {' '}
            <b>reconnu</b>
            {' '}
            par le Ministère de l&apos;Enseignement supérieur et
            de la Recherche
          </p>
          <div>
            <h2>J&apos;indique mon numéro INE</h2>
            <div className={styles.eligibilityInput}>
              <TextInput
                className="midlength-input"
                data-test-id="ine-input"
                value={INE}
                label="inscription 2024 - 2025"
                hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant ou sur le certificat de scolarité."
                messageType={error ? 'error' : ''}
                message={errorMessage}
                onChange={e => onChange(e.target.value)}
              />
              {showEligibility && (
                <span className={styles.text}>{eligibilityMessage()}</span>
              )}
            </div>
            <Button data-test-id="check-ine-button" disabled={isLoading} submit>
              Vérifier
            </Button>
            <section>
              <h2>
                Que faire si mon numéro INE n&apos;est pas reconnu ?
              </h2>
              <p>
                Il faut contrôler si votre établissement est bien reconnu par le
                Ministère de l&apos;Enseignement Supérieur et de la Recherche.
              </p>
            </section>
            <section>
              <ol className={styles.borderedList}>
                <li>Je suis étudiant en BTS : je suis éligible.</li>
                <li>
                  Je suis dans une université / institut / école. Rechercher mon
                  établissement :
                  <section className={styles.searchSchoolSection}>
                    <SearchableSelect
                      id="eligible-schools"
                      name="schoolName"
                      options={eligibleSchools.map(school => ({
                        value: school,
                        label: school,
                      }))}
                      selected={selectedEligibleSchool}
                      onChange={handleSelectedEligibleSchool}
                      className={styles.searchbar}
                    />
                    <Icon name="ri-search-line" className={styles.searchIcon} />
                  </section>
                  {selectedEligibleSchool && (
                    <span className={styles.text}>{eligibilityMessage()}</span>
                  )}
                </li>
              </ol>
              <p>
                Si votre établissement est dans la liste, vous pouvez consulter
                l&apos;étape suivante :
              </p>
              <Button
                disabled={isLoading}
                onClick={handleNextStep}
              >
                Étape suivante
                <Icon name="ri-arrow-right-s-fill" />
              </Button>
            </section>
            <section>
              <h2>
                Que faire si mon établissement n&apos;est pas reconnu par le
                Ministère de l&apos;Enseignement Supérieur et de la Recherche ?
              </h2>
              <p>
                Vous n&apos;êtes malheureusement pas éligible au dispositif. Vous
                pouvez néanmoins être accompagné par d&apos;autres dispositifs :
              </p>
              <ol className={styles.borderedList}>
                <li>
                  Contactez le
                  {' '}
                  <b>service de santé étudiante</b>
                  {' '}
                  de votre
                  établissement.
                  <Button
                    secondary
                    onClick={() => {
                      window.open(
                        'https://www.etudiant.gouv.fr/fr/les-services-de-sante-etudiante-sse-mode-d-emploi-3050',
                        '_blank',
                      );
                    }}
                    icon="ri-link"
                  />
                </li>
                <li>
                  <img src="images/human-cooperation.png" className={styles.holdingHandIcon} alt="trois mains qui s'entrecroisent" />
                  Consultez les autres services d&apos;aides en santé mentale.
                  <Button
                    secondary
                    onClick={() => {
                      navigate('/autres-services');
                    }}
                    icon="ri-link"
                  />
                </li>
                <li>
                  Consultez le dispositif pour la population générale &quot;Mon
                  soutien psy&quot;.
                  <Button
                    secondary
                    onClick={() => {
                      window.open(
                        'https://www.ameli.fr/assure/remboursements/rembourse/remboursement-seance-psychologue-mon-soutien-psy',
                        '_blank',
                      );
                    }}
                    icon="ri-link"
                  />
                </li>
                <li className={styles.noButton}>
                  Contactez-nous.
                </li>
              </ol>
            </section>
            <section className={styles.podcastSection}>
              <img src="/images/kaavan.png" alt="" />
              <div className={styles.podcastText}>
                <h2>Kaavan - Le podcast Santé Psy Étudiant </h2>
                <p>
                  Explorons le monde de la santé mentale !
                </p>
                <p>
                  Anxiété, mal-être, dépression, hypersensibilité, burn out, addictions, troubles alimentaires... préparez-vous à écouter des hi﻿stoires inspirantes, des voix authentiques et des conseils pratiques. Que vous soyez vous même touché, ou que vous accompagniez un proche.
                </p>
                <p>
                  Personnalités, anonymes, experts, on plonge ensemble dans des discussions intimes et bienveillantes où chacun peut trouver un écho à son propre parcours.
                </p>
                <p>
                  Parce la santé mentale c&apos;est aussi important que la santé physique !
                </p>
                <p>Kaavan est disponible sur toutes vos plateformes d’écoute préférées et sur Instagram :</p>
                <Button
                  onClick={() => {
                    window.open(
                      'https://linktr.ee/kaavanpodcast',
                      '_blank',
                    );
                  }}
                  icon="ri-headphone-fill"
                  aria-hidden="true"
                  hasBorder="false"
                >
                  Kaavan Podcast
                </Button>
              </div>
            </section>
          </div>
        </div>
      </form>
    </Page>
  );
};

export default observer(StudentEligibility);
