import React from 'react';
import { Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';
import useConsentAds from 'src/utils/googleAds/useConsentAds';
import pronouns, {
  capitalizeFirstLetter,
  pluralize,
} from '../utils/eligibilitySyntax';

const getMessage = (isEligible, lastAnswerValue, whoFor) => {
  const { trackGoogleAdsEligibility } = useConsentAds(true, true);
  const navigate = useNavigate();

  const trackRegisterClick = item => {
    if (__MATOMO__) {
      _paq.push(['trackEvent', 'studentRegister', type, item.question]);
    }
  };

  function handleButtonClick() {
    trackGoogleAdsEligibility();
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
    find,
  } = pronouns[whoFor] || pronouns.ME;

  if (isEligible) {
    const needsIneInfo = ['UNIVERSITY_DIPLOMA', 'BTS', 'CVEC'].includes(
      lastAnswerValue,
    );
    const needsBasicInfo = ['INE', 'BOTH'].includes(lastAnswerValue);

    const getIneMessage = () => {
      if (whoFor === 'SCHOOL') {
        return (
          <p>
            <br />
            Nous vous invitons à leur communiquer leur numéro INE ou à les
            renvoyer vers leur relevé de notes du baccalauréat.
            <br />
          </p>
        );
      }
      return (
        <p>
          {capitalizeFirstLetter(find)}
          {' '}
          sur
          {' '}
          {possesiveFem || possessive}
          {' '}
          carte
          étudiant ou
          {' '}
          {possessive}
          {' '}
          certificat de scolarité.
          <br />
          Si besoin,
          {' '}
          {pronoun === 'vous' ? 'tournez-vous' : 'il peut se tourner'}
          {' '}
          vers
          {' '}
          {possesiveFem || possessive}
          {' '}
          scolarité pour obtenir
          {' '}
          {possessive}
          {' '}
          numéro INE ou
          {' '}
          {find}
          {' '}
          sur
          {' '}
          {possessive}
          {' '}
          relevé de notes du baccalauréat.
          <br />
          <br />
        </p>
      );
    };
    const ineInfo = needsIneInfo ? getIneMessage() : null;

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
        {needsIneInfo || needsBasicInfo ? (
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
            {possessive}
            {' '}
            première consultation.
            <br />
            {ineInfo}
          </p>
        ) : null}
        {whoFor !== 'CONSULTANT' && (
          <p>
            <br />
            {renderRegisterButton(handleButtonClick)}
            <br />
            <em>
              {capitalizeFirstLetter(possessive)}
              {' '}
              certificat de scolarité
              {' '}
              {pronoun === 'vous' ? 'vous sera' : 'sera'}
              {' '}
              demandé pour
              {' '}
              {possesiveFem || possessive}
              {' '}
              première consultation.
            </em>
          </p>
        )}
        {whoFor === 'CONSULTANT' && (
          <>
            <em>
              {capitalizeFirstLetter(possessive)}
              {' '}
              certificat de scolarité doit
              également lui être demandé lors de
              {' '}
              {possesiveFem || possessive}
              {' '}
              première consultation.
            </em>
            <br />
            <Button
              onClick={() => navigate('/psychologue/login')}
              size="sm"
              className="fr-my-1w"
            >
              Créer le dossier de l&apos;étudiant
            </Button>
          </>
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
        N’hésitez pas à
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
    icon="fr-icon-arrow-right-s-line"
    iconPosition="right"
    size="sm"
    className="fr-my-1w"
  >
    S'inscrire en tant qu'étudiant
  </Button>
);

export default getMessage;
