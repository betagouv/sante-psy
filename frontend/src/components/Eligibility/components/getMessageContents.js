import React from 'react';
import { Button } from '@dataesr/react-dsfr';
import pronouns, { capitalizeFirstLetter, pluralize } from '../utils/eligibilitySyntax';

const getMessage = (
  isEligible,
  lastAnswerValue,
  whoFor,
  trackGoogleAdsEligibility,
  navigate,
) => {
  function handleButtonClick() {
    trackGoogleAdsEligibility();
    navigate('/trouver-un-psychologue');
  }

  const {
    subject,
    subjectNegativeBe,
    subjectNegativeHave,
    possessive,
    possesiveFem,
    pronoun,
    personalPronoun,
    take,
    find,
  } = pronouns[whoFor] || pronouns.ME;

  if (!isEligible) {
    const additionalText = lastAnswerValue === 'NO' || whoFor === 'SCHOOL' ||  lastAnswerValue ==='FOREIGN_SCHOOL' ? (
      <>
        Retrouvez cependant les différents services qui pourront
        {' '}
        {personalPronoun}
        accompagner ci-dessous.
      </>
    ) : (
      <>
        N’hésitez pas à
        {' '}
        {pronoun === 'vous'
          ? 'vous'
          : "l'inviter à se"}
        {' '}
        {' '}
        rapprocher de
        {' '}
        {possessive}
        {' '}
        service étudiant pour
        confirmer
        {' '}
        {subjectNegativeHave}
        {' '}
        ni numéro INE ni cotisation CVEC.
        <br />
        <br />
        Auquel cas, retrouvez les différents services qui pourront
        {' '}
        {personalPronoun}
        accompagner ci-dessous.
      </>
    );

    return (
      <>
        Nous sommes désolé,
        {' '}
        {subjectNegativeBe.toLowerCase()}
        {' '}
        hélas
        {' '}
        <b>
          pas
          {' '}
          {pluralize('éligible')}
        </b>
        {' '}
        au dispositif Santé Psy Étudiant.
        <br />
        <br />
        {additionalText}
      </>
    );
  }

  if (isEligible) {
    const needsIneInfo = ['UNIVERSITY_DIPLOMA', 'BTS', 'CVEC'].includes(
      lastAnswerValue,
    );
    const needsBasicInfo = ['INE', 'BOTH'].includes(lastAnswerValue);

    const getIneMessage = () => {
      if (whoFor === 'SCHOOL') {
        return (
          <>
            <br />
            Nous vous invitons à leur communiquer leur numéro INE ou à les renvoyer vers leur relevé de notes du baccalauréat.
            <br />
          </>
        );
      }
      return (
        <>
          {capitalizeFirstLetter(find)}
          {' '}
          sur
          {' '}
          {possesiveFem || possessive}
          {' '}
          carte étudiant ou
          {' '}
          {possessive}
          {' '}
          certificat de scolarité.
          <br />
          Si besoin,
          {' '}
          {pronoun === 'vous'
            ? 'tournez-vous'
            : 'il peut se tourner'}
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
          relevé de notes du
          baccalauréat.
          <br />
          <br />
        </>
      );
    };
    const ineInfo = needsIneInfo ? getIneMessage() : null;

    return (
      <>
        <b>
          {subject}
          {' '}
          {pluralize('éligible')}
          {' '}
          au dispositif Santé Psy Étudiant !
        </b>
        <br />
        {needsIneInfo || needsBasicInfo ? (
          <>
            {capitalizeFirstLetter(possessive)}
            {' '}
            <b>numéro INE</b>
            {' '}
            { whoFor === 'CONSULTANT' ? 'doit lui être demandé' : 'sera demandé par le psychologue'}
            {' '}
            pour la création de
            {' '}
            {possessive}
            {' '}
            dossier.
            <br />
            {ineInfo}
          </>
        ) : null}
        { whoFor != 'CONSULTANT' &&
          <>
            {take}
            {' '}
            rendez-vous dès à présent avec un psychologue partenaire :
            <br />
            {renderAppointmentButton(handleButtonClick)}
            <br />
            <em>
            {capitalizeFirstLetter(possessive)}
            {' '}
            certificat de scolarité
            {' '}
            {pronoun === 'vous' ? 'vous sera' : 'sera'}
            {' '}
            demandé lors de
            {' '}
            {possesiveFem || possessive}
            {' '}
            première consultation.
            </em>
          </>
        }
        { whoFor === 'CONSULTANT' &&
        <>
          <em>
            {capitalizeFirstLetter(possessive)}
            {' '}
            certificat de scolarité
            {' '}
            doit également lui être demandé lors de
            {' '}
            {possesiveFem || possessive}
            {' '}
            première consultation.
            </em>
            <br />
            <Button
              onClick={() => navigate('/mes-etudiants')}
              size="sm"
              className="fr-my-1w"
            >
              Créer le dossier de l'étudiant
            </Button>
            </>
        }
      </>
    );
  }
};

const renderAppointmentButton = handleButtonClick => (
  <Button
    onClick={handleButtonClick}
    icon="fr-icon-arrow-right-s-line"
    iconPosition="right"
    size="sm"
    className="fr-my-1w"
  >
    Prendre RDV
  </Button>
);

export default getMessage;
