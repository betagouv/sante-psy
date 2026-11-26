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
    'Catégories de données': 'Données relatives aux étudiants',
    'Durée de conservation': '3 ans à compter de la dernière connexion',
  },
  {
    'Catégories de données': 'Données relatives au formulaire de contact et au support',
    'Durée de conservation': '6 mois à compter de la réception du message',
  },
  {
    'Catégories de données': 'Données relatives à la traçabilité (logs, adresse IP)',
    'Durée de conservation': '1 an',
  },
  {
    'Catégories de données': 'Traceurs (mesure d’audience)',
    'Durée de conservation': '13 mois',
  },
];

const dataSubcontractor = [
  {
    'Partenaire / Garanties': <a href="https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles" target="_blank" rel="noreferrer">Scalingo</a>,
    Pays: 'France',
    'Traitement réalisé': "Hébergement de l'application et de la base de données, certifié HDS",
  },
  {
    'Partenaire / Garanties': <a href="https://www.scaleway.com/fr/contrats/" target="_blank" rel="noreferrer">Scaleway</a>,
    Pays: 'France',
    'Traitement réalisé': "Hébergement des justificatifs de scolarité déposés par les étudiants",
  },
  {
    'Partenaire / Garanties': <a href="https://help.crisp.chat/en/article/how-to-sign-my-gdpr-data-processing-agreement-dpa-1wfmngo/" target="_blank" rel="noreferrer">Crisp</a>,
    Pays: 'France',
    'Traitement réalisé': "Messagerie de support et suivi des demandes",
  },
  {
    'Partenaire / Garanties': <a href="https://static.tipimail.com/ressources/FR/DPA%20Sarbacane%20Software.pdf" target="_blank" rel="noreferrer">Tipimail</a>,
    Pays: 'France',
    'Traitement réalisé': "Envoi des courriels transactionnels (création de compte, liens de connexion, notifications)",
  },
  {
    'Partenaire / Garanties': <a href="https://www.brevo.com/legal/termsofuse/#appendix-3-data-processing-agreement-dpa" target="_blank" rel="noreferrer">Tipimail</a>,
    Pays: 'France',
    'Traitement réalisé': "Envoi des courriels d'information non transactionnels (lettres d'information aux psychologues)",
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
        Santé Psy Étudiant est un produit numérique porté par le ministère chargé de l’Enseignement supérieur, de la Recherche et de l’Espace (MESRE). Il vise à mettre en relation les étudiants et des psychologues habilités par les services de santé étudiante (SSE), dans le but de faire bénéficier les étudiants de 12 séances gratuites avec un psychologue.
      </p>
      <p>Le responsable de traitement est la direction générale de l'enseignement supérieur (DGESup), représentée par monsieur Olivier Ginez, en sa qualité de directeur général. Les universités conventionnées traitent également, sous leur propre responsabilité, les données nécessaires au conventionnement des psychologues et au paiement des séances.</p>
    </Section>
    <Section title="Pourquoi traitons-nous des données à caractère personnel ?">
      <ul className="fr-list">
        <li>Instruire les candidatures des psychologues et suivre leur conventionnement avec les universités ;</li>
        <li>Constituer, mettre à jour et publier l’annuaire des psychologues participant au dispositif ;</li>
        <li>Vérifier l’éligibilité des personnes s’inscrivant au dispositif ;</li>
        <li>Permettre aux étudiants et aux psychologues de suivre leur usage du dispositif ;</li>
        <li>Permettre la déclaration des séances réalisées, en vue de leur paiement par les universités et du suivi de l’usage;</li>
        <li>Répondre aux demandes d’assistance des étudiants, des psychologues et des universités ;</li>
        <li>Assurer la sécurité de la plateforme, la traçabilité des accès et la prévention des fraudes ;</li>
        <li>Produire des statistiques agrégées pour le pilotage du dispositif et de la politique de santé mentale étudiante ;</li>
        <li>Proposer aux étudiants des contenus d’information adaptés à leur situation.</li>
      </ul>
    </Section>
    <Section title="Quelles sont les données à caractère personnel que nous traitons ?">
      <ul className="fr-list">
        <li>Données relatives aux psychologues : nom, prénom, numéro RPPS, numéro de téléphone professionnel, adresse courriel, données de facturation, adresse postale professionnelle, logs et adresse IP ;</li>
        <li>Données relatives aux étudiants : nom, prénom, numéro INE, école, date de naissance, genre, adresse courriel, certificat de scolarité ou attestation CVEC, nom de l’établissement, type d’établissement, localisation de l’établissement, niveau d’études, domaine d’études, zone géographique de recherche, logs et adresse IP ;</li>
        <li>Données relatives aux personnels des universités référents du dispositif : Adresse électronique du référent du dispositif, nom, prénom, logs et adresse IP ;</li>
        <li>Données relatives au formulaire de contact et au support : nom, prénom, adresse courriel, contenu des échanges ;</li>
        <li>Données relatives aux visiteurs de la plateforme : logs de connexion et données issues des traceurs (voir la section « Témoins de connexion et traceurs »).</li>
      </ul>
      <p>Les données d’usage nominatives (exemples : dates et nombre de séances, psychologue consulté, étudiant bénéficiaire) ne sont accessibles qu’à l’étudiant concerné, au psychologue qui l’accompagne et aux membres habilités de l’équipe Santé Psy Étudiant à des fins de support. Elles ne sont jamais transmises à des tiers. Les universités et services de santé étudiante reçoivent uniquement les données nécessaires à la facturation / paiement des séances (nombre de séances déclarées par psychologue par mois).</p>
      <p>Aucune donnée clinique n’est collectée par la plateforme. Nous vous invitons à ne pas transmettre de données sensibles, notamment d’informations relatives à votre santé par le formulaire de contact ou le support.</p>
    </Section>
    <Section title="Comment collectons-nous vos données ?">
      <p>Les données sont collectées directement auprès de vous, lors de la création et de l’utilisation de votre espace (espace étudiant / espace psychologue).</p>
    </Section>
    <Section title="Qu’est-ce qui nous autorise à traiter des données à caractère personnel ?">
      <p>Nous traitons des données à caractère personnel selon la base légale de la mission d’intérêt public conformément à l’article 6-1 e) du RGPD. </p>
      <p>Cette mission d’intérêt public se traduit en pratique par le décret n° 2025-12 du 8 janvier 2025 relatif aux attributions du ministre auprès de la ministre d’Etat, ministre de l’éducation nationale, de l’enseignement supérieur, de la recherche et de l’espace, chargé de l’enseignement supérieur, de la recherche et de l’espace. </p>
    </Section>
    <Section title="Pendant combien de temps conservons-nous vos données ?">
      <p>Les données à caractère personnel sont conservées :</p>
      <SimpleTable data={dataConservation} />
    </Section>
    <Section title="Quels sont vos droits ? ">
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
        Ministère de l’Enseignement supérieur, de la Recherche et de l’Espace
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
      <ul className="fr-list">
        <li>Les membres habilités de l’équipe de Santé Psy Étudiant (support, vérification de l’éligibilité, suivi du conventionnement, sécurité, analyses statistiques globales) ;</li>
        <li>La DGSup, hors équipe Santé Psy Étudiant : statistiques agrégées uniquement ;</li>
        <li>Les psychologues conventionnés : données d’identification et statut du compte des étudiants qu’ils accompagnent et séances correspondantes ;</li>
        <li>Les services de santé étudiante et les universités : données des psychologues qui leur sont rattachés, nombre de séances agrégées, déclarées par les psychologues, pour le contrôle du service fait et le paiement, sans donnée nominative sur les étudiants.</li>
      </ul>
    </Section>
    <Section title="Qui nous aide à traiter vos données à caractère personnel ?">
      <SimpleTable data={dataSubcontractor} />
    </Section>
    <Section title="Sécurité et confidentialité des données">
      <p>
        Le responsable de traitement prend les mesures techniques et opérationnelles nécessaires conformément à l’article 32 du RGPD afin d’assurer la sécurité et la confidentialité des données telles que le chiffrement, la double authentification pour les accès d’administration et le cloisonnement des accès.</p>
    </Section>
    <Section title="Témoins de connexion et traceurs">
      <p>
        Un témoin de connexion est un fichier déposé sur votre terminal lors de la visite d’un site. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal (ordinateur, mobile ou tablette). Santé Psy Étudiant dépose des témoins de connexion, notamment pour la mesure d’audience sur son service. Le dépôt s’effectue uniquement lorsque l’utilisateur a consenti via le bandeau prévu à cet effet. L’utilisateur peut à tout moment revenir sur son choix.
      </p>
      <p>Nous utilisons l’outil de mesure d’audience Matomo, configuré en mode “exempté” et ne nécessitant pas le recueil de votre consentement conformément aux recommandations de la CNIL. Les adresses IP sont anonymisées et les données ne sont pas croisées avec d’autres traitements.</p>
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
