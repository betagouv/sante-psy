import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, TextInput, Icon, SearchableSelect } from '@dataesr/react-dsfr';
import Page from 'components/Page/Page';
import agent from 'services/agent';
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

  const submit = e => {
    e.preventDefault();
    setIsLoading(true);
    agent.Eligibility.get({ ine: INE })
      .then(response => {
        setIsEligible(response);
        setShowEligibility(true);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.response.data && err.response.data.message) {
          setErrorMessage(err.response.data.message);
          setError(true);
        }
        setIsLoading(false);
      });
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
            <p>Vous êtes éligible au dispositif</p>
          </Icon>
        </div>
      );
    }
    return (
      <div
        className={classNames(
          styles.eligibilityMessage,
          styles.eligibilityMessage_error,
        )}
      >
        <Icon
          name="ri-close-circle-fill"
          size="lg"
          color="#ce0500"
          iconPosition="left"
        >
          <p>Numéro INE inconnu ou non éligible au dispositif</p>
        </Icon>
      </div>
    );
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
            {/* <p>inscription 2023-2024</p> */}
            <div className={styles.eligibilityInput}>
              <TextInput
                className="midlength-input"
                data-test-id="ine-input"
                value={INE}
                label="inscription 2023 - 2024"
                hint="Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant."
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
                      className={styles.searchbar}
                    />
                    <Icon name="ri-search-line" className={styles.searchIcon} />
                  </section>
                </li>
                <li>Je suis étudiant en BTS : je suis éligible.</li>
              </ol>
              <p>
                Si votre établissement est dans la liste, vous pouvez consulter
                l&apos;étape suivante :
              </p>
              <Button
                disabled={isLoading}
                onClick={() => navigate('/#step-prescription-letter')}
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
                    className={styles.linkButton}
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

                <li>
                  Si vous souhaitez tout de même vérifier votre éligibilité,
                  contactez-nous.
                  <Button
                    secondary
                    onClick={() => {
                      navigate('/eligibility/contact');
                    }}
                    icon="ri-link"
                  />
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
