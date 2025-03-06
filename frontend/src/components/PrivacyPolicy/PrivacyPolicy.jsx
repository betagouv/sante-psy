import React from 'react';
import { SimpleTable } from '@dataesr/react-dsfr';

import Page from 'components/Page/Page';
import Section from 'components/Page/Section';

const dataConservation = [
  {
    'Catégories de données': "Données d'inscription",
    'Durée de conservation': '3 ans à compter de la dernière utilisation du compte',
  },
  {
    'Catégories de données': 'Données relatives aux séances',
    'Durée de conservation': '3 ans à compter de la dernière utilisation du compte',
  },
  {
    'Catégories de données': 'Données de contact',
    // eslint-disable-next-line max-len
    'Durée de conservation': "3 ans à compter de l'écrit du message. S’agissant de la demande d’informations, l’adresse e-mail n’est pas stockée par Santé Psy Étudiant après l’envoi du courrier.",
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
    'Traitement réalisé': 'Messagerie et chatbot',
    Garanties: <a href="https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo/" target="_blank" rel="noreferrer">https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo</a>,
  },
  {
    Partenaire: 'Démarches simplifiées',
    Pays: 'France',
    'Traitement réalisé': 'Dématérialisation de Démarches Administrative',
    Garanties: <a href="https://doc.demarches-simplifiees.fr/cgu/cgu" target="_blank" rel="noreferrer">https://doc.demarches-simplifiees.fr/cgu/cgu</a>,
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
    Garanties: <a href="https://privacy.google.com/intl/fr_fr/businesses/compliance/#!?modal_active=none" target="_blank" rel="noreferrer">https://privacy.google.com/intl/fr_fr/businesses/compliance/#!?modal_active=none</a>,
  },
  {
    Cookies: 'Facebook Cookie Pixel',
    'Traitement réalisé':
  <>
    <p>Outil de gestion de balises permettant de suivre et mesurer les publicités.</p>
    <p>Il identifie les visiteurs en provenance de publications Facebook.</p>
  </>,
    'Base juridique': 'Consentement',
    Garanties: <a href="https://www.facebook.com/business/help/471978536642445?id=1205376682832142" target="_blank" rel="noreferrer">https://www.facebook.com/business/help/471978536642445?id=1205376682832142</a>,

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
        Le présent site Santé Psy Étudiant est à l’initiative de l’Incubateur
        de services numériques de la Direction interministérielle du numérique (DINUM),
        qui en est le responsable de traitement.
      </p>
    </Section>
    <Section title="Pourquoi traitons-nous des données à caractère personnel ?">
      <p>
        « Santé Psy Étudiant » vise à mettre en relation étudiants et psychologues afin de permettre
        la réalisation de séances gratuites, en application des annonces du Président de la République
        et du Premier Ministre, le Ministère de l’Enseignement Supérieur et de la Recherche (MESR)
        pour le déploiement d’un ensemble de mesures destinées à soutenir psychologiquement les étudiants au cours de l’année 2021.
      </p>
    </Section>
    <Section title="Quelles sont les données à caractère personnel que nous traitons ?">
      <p>Sont traitées les données suivantes :</p>
      <ul className="fr-list">
        <li> Données relatives aux psychologues : nom, prénom, numéro de téléphone professionnel, adresse e-mail professionnelle et personnelle, logs et adresse IP ; </li>
        <li> Données relatives aux étudiants : nom, prénom. La date de naissance et le numéro étudiant sont facultatifs ; </li>
        <li> Données relatives au formulaire de contact : nom, prénom, adresse e-mail, champs libres. </li>
      </ul>
      <p>
        Les données introduites par le psychologue pour générer la facture sont collectées localement,
        de ce fait elles ne sont pas traitées par Santé Psy Etudiant. Il en est de même lorsque
        l’utilisateur décide d’activer la localisation sur la recherche dans l’annuaire des psychologues.
        En effet, cette donnée n’est pas collectée ni conservée par Santé Psy Étudiant,
        qui ne peut donc pas la relier à un utilisateur. La donnée est traitée directement sur le navigateur de
        l’utilisateur après avoir exprimé son consentement.
      </p>
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
        Par voie numérique : envoyez-nous un email à
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
      <p>Par voie postale :</p>
      <p>
        A l’attention du ou de la Chargé(e) de mission sur le
        dispositif Santé Psy Etudiant
        <br />
        Sous-direction de la vie étudiante - DGESIP A2
        <br />
        1 rue Descartes
        <br />
        75005 Paris
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
        un modèle de courrier élaboré par la Cnil.
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
        traitées par Santé Psy Etudiant.
      </p>
    </Section>
    <Section title="Cookies et traceurs">
      <p>
        Un cookie est un fichier déposé sur votre terminal lors de la visite d’un site. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal (ordinateur, mobile ou tablette).
      </p>
      <p>
        En application de l’article 5(3) de la directive 2002/58/CE modifiée concernant le traitement des données à caractère personnel et la protection de la vie privée dans le secteur des communications électroniques, transposée à l’article 82 de la loi n°78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs ou cookies suivent deux régimes distincts.
      </p>
      <p>
        Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de faciliter la communication par voie électronique sont dispensés de consentement préalable au titre de l’article 82 de la loi n°78-17 du 6 janvier 1978.
      </p>
      <p>
        Les cookies n’étant pas strictement nécessaires au service ou n’ayant pas pour finalité exclusive de faciliter la communication par voie électronique doivent être consenti par l’utilisateur.
        Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques constitue une base légale au sens du RGPD et doit être entendu au sens de l’article 6-a du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et à la libre circulation de ces données.
      </p>
      <SimpleTable data={dataCookies} />
      <p>
        Vous pouvez à tout moment accepter, refuser ou revenir sur votre consentement concernant le dépôt de cookies via le bandeau mis à disposition sur la page concernée
        {' '}
        <a href="https://santepsy.etudiant.gouv.fr/etudiant" target="_blank" rel="noreferrer">santepsy.etudiant.gouv.fr/etudiant</a>
        {' '}
      </p>
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
