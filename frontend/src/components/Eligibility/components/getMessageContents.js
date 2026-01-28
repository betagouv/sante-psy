import React from 'react';
import { Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import pronouns, {
  capitalizeFirstLetter,
  pluralize,
} from '../utils/eligibilitySyntax';

const getMessage = (isEligible, lastAnswerValue, whoFor) => {
  const navigate = useNavigate();

  const trackRegisterClick = () => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'Student', 'studentSignIn']);
    }
  };

  function handleButtonClick() {
    trackRegisterClick();
    navigate('/inscription');
  }

  const {
    subject,
    subjectNegativeBe,
    subjectNegativeHave,
    possessive,
    possesiveFem,
    pronoun,
    personalPronoun,
    otherPersonalPronoun,
  } = pronouns[whoFor] || pronouns.ME;

  if (isEligible) {
    const needsIneInfo = ['UNIVERSITY_DIPLOMA', 'BTS', 'CVEC'].includes(
      lastAnswerValue,
    );
    const needsBasicInfo = ['INE', 'BOTH'].includes(lastAnswerValue);
    return (
      <>
        <b>
          {subject}
          {' '}
          {pluralize('éligible', whoFor)}
          {' '}
          au dispositif Santé Psy Étudiant !
        </b>
        <br />
        {(needsIneInfo || needsBasicInfo) && (
          <p>
            {capitalizeFirstLetter(possessive)}
            {' '}
            <b>certificat de scolarité</b>
            {' '}
            {whoFor === 'CONSULTANT' ? '' : otherPersonalPronoun}
            {' '}
            {whoFor === 'CONSULTANT'
              ? 'doit lui être demandé'
              : 'sera demandé par le psychologue'}
            {' '}
            pour
            {' '}
            {possesiveFem || possessive}
            {' '}
            première consultation.
            <br />
            {whoFor !== 'CONSULTANT' ? (
              renderRegisterButton(handleButtonClick)
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  size="sm"
                  className="fr-my-1w"
                >
                  Créer le dossier de l&apos;étudiant
                </Button>
                <br />
              </>
            )}
          </p>
        )}
      </>
    );
  }

  const additionalText = lastAnswerValue === 'NO'
    || whoFor === 'SCHOOL'
    || lastAnswerValue === 'FOREIGN_SCHOOL' ? (
      <p>
        Retrouvez cependant les différents services qui pourront
        {' '}
        {personalPronoun}
        {' '}
        accompagner ci-dessous.
      </p>
    ) : (
      <p>
        N&apos;hésitez pas à
        {' '}
        {pronoun === 'vous' ? 'vous' : "l'inviter à se"}
        {' '}
        rapprocher de
        {' '}
        {possessive}
        {' '}
        service étudiant pour confirmer
        {' '}
        {subjectNegativeHave}
        {' '}
        ni numéro INE ni cotisation CVEC.
        <br />
        <br />
        Auquel cas, retrouvez les différents services qui pourront
        {' '}
        {personalPronoun}
        {' '}
        accompagner ci-dessous.
      </p>
    );

  return (
    <>
      <p>
        Nous sommes désolés,
        {' '}
        {subjectNegativeBe.toLowerCase()}
        {' '}
        hélas
        {' '}
        <b>
          pas
          {' '}
          {pluralize('éligible', whoFor)}
        </b>
        {' '}
        au dispositif Santé Psy Étudiant.
      </p>
      <br />
      {additionalText}
    </>
  );
};

const renderRegisterButton = handleButtonClick => (
  <Button
    onClick={handleButtonClick}
    size="sm"
    className="fr-my-1w"
  >
    S&apos;inscrire à l&apos;Espace Étudiant
  </Button>
);

export default getMessage;
