import React from 'react';
import { SimpleTable } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import Section from 'components/Page/Section';

const dataConservation = [
  {
    'Catégories de données': 'Données relatives aux psychologues',
    'Durée de conservation': '3 ans à compter de la dernière connexion',
  },
  {
    'Catégories de données': 'Données relatives au formulaire de contact',
    'Durée de conservation': '6 mois à compter de la réception du message',
  },
];

const dataSubcontractor = [
  {
    Partenaire: 'Heroku',
    Pays: 'Etats-Unis',
    'Traitement réalisé': 'Hébergeur',
    Garanties: <a href="https://www.salesforce.com/content/dam/web/en_us/www/documents/legal/Agreements/data-processing-addendum.pdf" target="_blank" rel="noreferrer">https://www.salesforce.com/content/dam/web/en_us/www/documents/legal/Agreements/data-processing-addendum.pdf</a>,
  },
  {
    Partenaire: 'Scalingo',
    Pays: 'France',
    'Traitement réalisé': 'Hébergeur',
    Garanties: <a href="https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles" target="_blank" rel="noreferrer">https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles</a>,
  },
  {
    Partenaire: 'Crisp',
    Pays: 'France',
    'Traitement réalisé': 'Outil de support et de chat',
    Garanties: <a href="https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo/" target="_blank" rel="noreferrer">https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo</a>,
  },
];

const dataCookies = [
  {
    Cookies: 'Google Ads',
    'Traitement réalisé':
  <>
    <p>Outil de gestion de balises permettant de suivre et mesurer les publicités.</p>
    <p>Il mesure l’efficacité des campagnes sponsorisées.</p>
  </>,
    'Base juridique': 'Consentement',
    Garanties: <a href="https://www.google.com/analytics/terms/dpa/dataprocessingamendment_20200816.html" target="_blank" rel="noreferrer">https://www.google.com/analytics/terms/dpa/dataprocessingamendment_20200816.html</a>,
  },
  {
    Cookies: 'Facebook Cookie Pixel',
    'Traitement réalisé':
  <>
    <p>Outil de gestion de balises permettant de suivre et mesurer les publicités.</p>
    <p>Il identifie les visiteurs en provenance de publications Facebook.</p>
  </>,
    'Base juridique': 'Consentement',
    Garanties: <a href="https://www.facebook.com/legal/terms/dataprocessing" target="_blank" rel="noreferrer">https://www.facebook.com/legal/terms/dataprocessing</a>,

  },
];

const PrivacyPolicy = () => (
  <Page
    title="Politique de confidentialité"
    withoutHeader
    textContent
    >
    <h1 className="secondaryPageTitle">Politique de confidentialité</h1>
    <Section title="Qui sommes-nous ?">
      <p>
        Santé Psy Étudiant est un service numérique porté depuis février 2021 par le ministère chargé de l’enseignement supérieur et de la recherche (MESR). Il vise à mettre en relation les étudiants et des psychologues habilités par les services de santé étudiante (SSE), dans le but de faire bénéficier aux étudiants de 12 séances gratuites avec un psychologue.
      </p>
    </Section>
    <Section title="Pourquoi traitons-nous des données à caractère personnel ?">
      <p>
        Santé Psy Étudiant traite des données à caractère personnel pour permettre aux psychologues de se connecter à leurs espaces personnels, mettre en place un observatoire statistique relatif à la santé mentale des jeunes et à toute personne notamment les étudiants et psychologues, de prendre contact avec l’équipe de Santé Psy Étudiant.
      </p>
    </Section>
    <Section title="Quelles sont les données à caractère personnel que nous traitons ?">
      <ul className="fr-list">
        <li> Données relatives aux psychologues : nom, prénom, numéro de téléphone professionnel, adresse courriel, logs et adresse IP ; </li>
        <li> Données relatives aux étudiants : nom, prénom, numéro INE, école, date de naissance, genre ; </li>
        <li> Données relatives au formulaire de contact : nom, prénom, adresse courriel, champs libres. </li>
      </ul>
    </Section>
    <Section title="Qu’est-ce qui nous autorise à traiter des données à caractère personnel ?">
      <p>Nous traitons des données à caractère personnel selon la base légale de la mission d’intérêt public conformément à l’article 6-1 e) du RGPD. </p>
      <p>Cette mission d’intérêt public se traduit en pratique par le décret n° 2025-12 du 8 janvier 2025 relatif aux attributions du ministre auprès de la ministre d’Etat, ministre de l’éducation nationale, de l’enseignement supérieur et de la recherche, chargé de l’enseignement supérieur et de la recherche. </p>
    </Section>
    <Section title="Pendant combien de temps conservons-nous vos données ?">
      <p>Les données à caractère personnel sont conservées :</p>
      <SimpleTable data={dataConservation} />
    </Section>
    <Section title="Quels sont vos droits ? ">
      <p>
        Vous disposez des droits suivants concernant vos données à caractère personnel:
      </p>
      <ul className="fr-list">
        <li>
          Droit d’information et droit d’accès aux données;
        </li>
        <li>
          Droit de rectification;
        </li>
        <li>
          Droit d’opposition;
        </li>
        <li>
          Droit à la limitation du traitement de vos données.
        </li>
      </ul>
      <p>
        Par voie électronique : envoyez-nous un courriel à
        {' '}
        <a
          href="mailto:support-santepsyetudiant@beta.gouv"
          target="_blank"
          rel="noreferrer"
          >
          support-santepsyetudiant@beta.gouv
        </a>
        {' '}
        ou contactez-nous sur
        {' '}
        <a
          href="https://santepsy.etudiant.gouv.fr/contact/formulaire"
          target="_blank"
          rel="noreferrer"
          >
          santepsy.etudiant.gouv.fr/contact/formulaire
        </a>
        {' '}
      </p>
      <p>
        Vous pouvez prendre attache avec le délégué à la protection des données à l’adresse suivante :
        {' '}
        <a
          href="mailto:dpd@education.gouv.fr"
          target="_blank"
          rel="noreferrer"
          >
          dpd@education.gouv.fr
        </a>
        {' '}
      </p>
      <p>
        Via le formulaire de saisine en ligne :
        {' '}
        <a
          href="https://www.enseignementsup-recherche.gouv.fr/fr/nous-contacter-49937#dpd"
          target="_blank"
          rel="noreferrer"
          >
          https://www.enseignementsup-recherche.gouv.fr/fr/nous-contacter-49937#dpd
        </a>
        {' '}
      </p>
      <p>Ou par voie postale :</p>
      <p>
        Ministère de l’Enseignement supérieur et de la Recherche
        <br />
        Délégué à la protection des données (DPD)
        <br />
        1 rue Descartes
        <br />
        75231 Paris Cedex 5
      </p>
      <p>
        En raison de l’obligation de sécurité et de confidentialité
        dans le traitement des données à caractère personnel qui incombe au
        responsable de traitement, votre demande ne sera traitée que si vous
        apportez la preuve de votre identité. Pour vous aider dans votre
        démarche, vous trouverez
        {' '}
        <a
          href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces"
          target="_blank"
          rel="noreferrer"
          >
          ici
        </a>
        {' '}
        un modèle de courrier élaboré par la CNIL.
      </p>
      <p>
        Le responsable de traitement s’engage à répondre dans un délai raisonnable qui ne saurait
        dépasser 1 mois à compter de la réception de votre demande.
      </p>
    </Section>
    <Section title="Qui va avoir accès à vos données ? ">
      <p>
        Le responsable de traitement s‘engage à ce que les données à caractères personnels soient traitées par les seules personnes autorisées:
      </p>
      <ul className="fr-list">
        <li>
          Les membres habilités de l’équipe de Santé Psy Étudiant.
        </li>
      </ul>
    </Section>
    <Section title="Qui nous aide à traiter vos données à caractère personnel ?">
      <p>
        Certaines des données sont envoyées à des sous-traitants pour
        réaliser certaines missions. Le responsable de traitement s’est
        assuré de la mise en œuvre par ses sous-traitants de garanties
        adéquates et du respect de conditions strictes de confidentialité,
        d’usage et de protection des données.
      </p>
      <SimpleTable data={dataSubcontractor} />
    </Section>
    <Section title="Sécurité et confidentialité des données">
      <p>
        Le responsable de traitements prend les mesures techniques et
        opérationnelles nécessaires afin d’assurer la sécurité et la
        confidentialité des données telles que le chiffrement et le
        cloisonnement des accès. Des audits et analyses de code sont
        également effectués.
      </p>
      <p>
        En ce sens les données introduites par le psychologue pour générer
        la facture sont collectées localement, de ce fait elles ne sont pas
        traitées par Santé Psy Etudiant. De même, lorsque l’utilisateur recherche un psychologue autour de son emplacement, les données de géolocalisation sont collectées par le navigateur et ne sont pas remontées à l’équipe de Santé Psy Étudiant.
      </p>
    </Section>
    <Section title="Témoins de connexion et traceurs">
      <p>
        Un témoin de connexion est un fichier déposé sur votre terminal lors de la visite d’un site. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal (ordinateur, mobile ou tablette).
        Santé Psy Étudiant dépose des témoins de connexion, notamment pour la mesure d’audience sur son service. Le dépôt s’effectue uniquement lorsque l’utilisateur a consenti via le bandeau prévu à cet effet. L’utilisateur peut à tout moment revenir sur son choix.
        Témoins de connexion déposés :
      </p>
      <SimpleTable data={dataCookies} />
      <p>Nous utilisons également l’outil de mesure d’audience Matomo, configuré en mode “exempté” et ne nécessitant pas le recueil de votre consentement conformément aux recommandations de la CNIL.</p>
      <iframe title="Matomo opt-out" style={{ border: 'none', width: '90%' }} src="https://stats.beta.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=2f3b6c&fontSize=16px&fontFamily=sans-serif" />
      <p>
        Pour aller plus loin, vous pouvez consulter les fiches proposées par
        la Commission Nationale de l’Informatique et des Libertés
        (CNIL) :
      </p>
      <ul className="fr-list">
        <li>
          <a
            href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi"
            target="_blank"
            rel="noreferrer"
            >
            Cookies et traceurs : que dit la loi ?
          </a>
        </li>
        <li>
          <a
            href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser"
            target="_blank"
            rel="noreferrer"
            >
            Cookies : les outils pour les maîtriser
          </a>
        </li>
      </ul>
    </Section>
  </Page>
);

export default PrivacyPolicy;
