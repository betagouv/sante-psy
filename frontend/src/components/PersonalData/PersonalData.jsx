import React from 'react';

import Page from 'components/Page/Page';
import Mail from 'components/Footer/Mail';
import styles from './personalData.cssmodule.scss';

const PersonalData = () => (

  <Page
    title="Suivi d&#39;audience et vie privée"
    background="blue"
  >
    <div className={styles.container}>
      <h2 className={styles.subtitle}>Cookies déposés et opt-out</h2>
      <p>
        Ce site dépose un petit fichier texte (un « cookie ») sur votre ordinateur lorsque vous le consultez.
        Cela nous permet de mesurer le nombre de visites et de comprendre quelles sont les pages les plus consultées.
      </p>

      <p>Information sur votre suivi : </p>
      <iframe
        title="stats"
        style={{ border: 0, height: 152, width: '80%' }}
        src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=&fontSize=&fontFamily=%22Marianne%22%2C%20arial%2C%20sans-serif"
      />

      <h2 className={styles.subtitle}>
        Ce site n’affiche pas de bannière de consentement aux cookies, pourquoi ?
      </h2>
      <p>
        C’est vrai, vous n’avez pas eu à cliquer sur un bloc qui recouvre la moitié de la page
        pour dire que vous êtes d’accord avec le dépôt de cookies — même si vous ne savez pas ce que ça veut dire !
      </p>
      <p>
        Rien d’exceptionnel, pas de passe-droit lié à un
        {' '}
        <code className="language-plaintext highlighter-rouge">.gouv.fr</code>
        . Nous respectons simplement la loi, qui dit que certains outils de suivi d’audience,
        correctement configurés pour respecter la vie privée, sont exemptés d’autorisation préalable.
      </p>

      <p>
        Nous utilisons pour cela
        {' '}
        <a href="https://matomo.org/" target="_blank" rel="noopener noreferrer">Matomo</a>
        , un outil
        {' '}
        <a href="https://matomo.org/free-software/" target="_blank" rel="noopener noreferrer">libre</a>
        , paramétré pour être en conformité avec la
        {' '}
        <a href="https://www.cnil.fr/fr/solutions-pour-la-mesure-daudience" target="_blank" rel="noopener noreferrer">recommandation « Cookies »</a>
        {' '}
        de la
        {' '}
        <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr>
        . Cela signifie que votre adresse IP, par exemple, est anonymisée avant d’être enregistrée.
        Il est donc impossible d’associer vos visites sur ce site à votre personne.
      </p>

      <h2 className={styles.subtitle}>
        Je contribue à enrichir vos données, puis-je y accéder ?
      </h2>

      <p>
        Bien sûr ! Les statistiques d’usage sont disponibles en accès libre sur
        {' '}
        <a target="_blank" rel="noopener noreferrer" href="https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&date=yesterday&period=day&idSite=160#?idSite=160&period=day&date=yesterday&segment=&category=Dashboard_Dashboard&subcategory=1">stats.data.gouv.fr</a>
        .
      </p>
      <Mail />
    </div>
  </Page>
);

export default PersonalData;
