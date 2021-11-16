import React from 'react';
import { SimpleTable, Title } from '@dataesr/react-dsfr';
import { useStore } from 'stores/';

import Page from 'components/Page/Page';
import Section from 'components/Page/Section';

const dataConservation = [
  {
    'Catégories de données': "Données d'inscription",
    'Durée de conservation': '5 ans à compter de la dernière utilisation du compte',
  },
  {
    'Catégories de données': 'Données relatives aux séances',
    'Durée de conservation': '5 ans à compter de la dernière utilisation du compte',
  },
  {
    'Catégories de données': 'Données de contact',
    'Durée de conservation': "5 ans à compter de l'écrit du message",
  },
  {
    'Catégories de données': 'Données de connexion',
    // eslint-disable-next-line max-len
    'Durée de conservation': "Ces données sont conservées 12 mois, en application de la loi pour la confiance dans l'économie numérique n°2004-575 du 21 juin 2004 et de l'article 3 du décret n°2011-219 du 25 février 2011.",
  },
  {
    'Catégories de données': 'Cookies',
    'Durée de conservation': 'Ces données sont conservées 13 mois maximum.',
  },
];

const dataSubcontractor = [
  {
    Partenaire: 'Heroku',
    Pays: 'Etats-Unis',
    'Traitement réalisé': 'Hébergeur',
    Garanties: <a href="https://www.salesforce.com/company/privacy" target="_blank" rel="noreferrer">https://www.salesforce.com/company/privacy</a>,
  },
  {
    Partenaire: 'Scalingo',
    Pays: 'France',
    'Traitement réalisé': 'Hébergeur',
    Garanties: <a href="https://scalingo.com/fr/privacy-policy" target="_blank" rel="noreferrer">https://scalingo.com/fr/privacy-policy</a>,
  },
  {
    Partenaire: 'Crisp',
    Pays: 'France',
    'Traitement réalisé': 'Messagerie',
    Garanties: <a href="https://crisp.chat/fr/privacy/" target="_blank" rel="noreferrer">https://crisp.chat/fr/privacy/</a>,
  },
  {
    Partenaire: 'Démarches simplifiées',
    Pays: 'France',
    'Traitement réalisé': 'Dématérialisation de Démarches Administrative',
    Garanties: <a href="https://doc.demarches-simplifiees.fr/cgu/cgu" target="_blank" rel="noreferrer">https://doc.demarches-simplifiees.fr/cgu/cgu</a>,
  },
];

const PrivacyPolicy = () => {
  const { commonStore: { config } } = useStore();

  return (
    <Page
      title="Politique de confidentialité"
      background="blue"
      textContent
    >
      <Section title="Traitement des données à caractère personnel">
        <p>
          Le présent site Santé Psy Étudiant est à l&lsquo;initiative de
          l&lsquo;Incubateur de services numériques de la Direction
          interministérielle du numérique (DINUM), qui en est le responsable
          de traitement.
        </p>
      </Section>
      <Section title="Finalité">
        <p>
          &laquo; Santé Psy Étudiant &raquo; vise à mettre en relation étudiants et
          psychologues afin de permettre la réalisation de séances gratuites,
          en application des annonces du Président de la République et du
          Premier Ministre, le Ministère de l&lsquo;Enseignement Supérieur, de
          la Recherche et de l&lsquo;Innovation (MESRI) pour le déploiement
          d&lsquo;un ensemble de mesures destinées à soutenir
          psychologiquement les étudiants au cours de l&lsquo;année 2021.
        </p>
      </Section>
      <Section title="Données à caractère personnel traitées">
        <p>Sont traitées les données suivantes :</p>
        <Title as="h3" look="h6">
          Données d&lsquo;inscription (psychologues)
        </Title>
        <p>
          Pour participer au dispositif Santé Psy Étudiant, les psychologues
          doivent obligatoirement en faire la demande en renseignant un
          formulaire au travers de &laquo; démarches simplifiées &raquo; (
          <a
            href={config.demarchesSimplifieesUrl}
            target="_blank"
            rel="noreferrer"
          >
            cliquez ici pour accéder au formulaire
          </a>
          ). Le service de santé universitaire (SSU) le
          plus proche du lieu d&lsquo;exercice procédera à l&lsquo;examen de
          la demande.
        </p>
        <p>Il s&lsquo;agit du :</p>
        <ul className="fr-list">
          <li> Nom, prénom </li>
          <li> Numéro ADELI </li>
          <li> Adresse du cabinet </li>
          <li> Téléphone professionnel </li>
          <li> Adresse mail professionnelle </li>
          <li> Adresse mail personnelle </li>
          <li> Site internet professionnel </li>
          <li> Langues parlées </li>
          <li>
            Diplômes (Intitulé, année d&lsquo;obtention, formation et
            expériences)
          </li>
          <li> Possibilité de téléconsultation </li>
          <li> Données de l&lsquo;espace de présentation </li>
        </ul>
        <p>
          Les données collectées suivantes sont ensuite partagées dans la
          partie &laquo; Trouver un psychologue &raquo; : nom, prénom, adresse du cabinet,
          téléphone professionnel, adresse mail professionnelle, langues
          parlées. Certaines données sont optionnelles, et il est également
          indiqué au psychologue de ne mettre que les informations strictement
          nécessaires à sa présentation dans l&lsquo;espace dédié.
        </p>
        <Title as="h3" look="h6">
          Données relatives aux séances (étudiants)
        </Title>
        <p>Le psychologue déclare sur la plateforme les donnes suivantes :</p>
        <ul className="fr-list">
          <li> Nom, prénom de l&lsquo;étudiant </li>
          <li> Date de naissance (optionnel) </li>
          <li> Numéro étudiant (optionnel) </li>
          <li> Nombre de séances </li>
          <li> Nom de l&lsquo;établissement supérieur (optionnel) </li>
          <li> Ville du médecin qui a orienté l&lsquo;étudiant (optionnel) </li>
          <li> Nom du médecin qui a orienté l&lsquo;étudiant (optionnel) </li>
        </ul>
        <p>Certaines données sont communiquées de manière facultative.</p>
        <Title as="h3" look="h6">
          Données de contact
        </Title>
        <p>
          Lorsque le formulaire de contact est rempli, les données suivantes
          sont collectées :
        </p>
        <ul className="fr-list">
          <li> Nom </li>
          <li> Prénom </li>
          <li> Email </li>
          <li> Motif </li>
        </ul>
        <p>
          Il est demandé dans le cadre de la prise de contact et du champ
          libre &laquo; Message &raquo; de ne fournir que les donnes personnelles
          strictement nécessaires au traitement de la demande.
        </p>
        <Title as="h3" look="h6">
          Données de connexion
        </Title>
        <p>Les données de connexion conservées sont :</p>
        <ul className="fr-list">
          <li> Token de connexion </li>
          <li> Identifiant de connexion </li>
          <li>
            Logs de connexion (journaux d&lsquo;événements : date de demande
            de connexion, date d&lsquo;expiration du token)
          </li>
        </ul>
        <Title as="h3" look="h6">
          Cookies
        </Title>
        <p>
          Les cookies collectés sont les cookies nécessaires au fonctionnement
          de la plateforme ainsi que ceux permettant d&lsquo;établir des
          mesures statistiques.
        </p>
        <Title as="h3" look="h6">
          Autres données
        </Title>
        <p>
          Les données introduites par le psychologue pour générer la facture
          sont collectées localement, de ce fait elles ne sont pas traitées
          par Santé Psy Etudiant. Il en est de même lorsque
          l&lsquo;utilisateur décide d&lsquo;activer la localisation sur la
          recherche dans l&lsquo;annuaire des psychologues. En effet, cette
          donnée n&lsquo;est pas collectée ni conservée par Santé Psy
          Etudiant, qui ne peut donc pas la relier à un utilisateur. La donnée
          est traitée directement sur le navigateur de l&lsquo;utilisateur
          après avoir exprimé son consentement.
        </p>
      </Section>
      <Section title="Base juridique du traitement de données">
        <p>
          Les données traitées à l&lsquo;occasion de ces traitements ont
          plusieurs fondements juridiques :
        </p>
        <ul className="fr-list">
          <li>
            L&lsquo;exécution d&lsquo;une mission d&lsquo;intérêt public ou
            relevant de l&lsquo;exercice de l&lsquo;autorité publique dont est
            investi le responsable de traitement au sens de l&lsquo;article
            6-e du RPGD ;
          </li>
          <li>
            L&lsquo;obligation légale à laquelle est soumise le responsable de
            traitements au sens de l&lsquo;article 6-c du RGPD ;
          </li>
        </ul>
        <p>Ces fondements sont précisés ci-dessous :</p>
        <Title as="h3" look="h6">
          Données d&lsquo;inscription
        </Title>
        <p>
          Ce traitement de données est nécessaire à l&lsquo;exercice
          d&lsquo;une mission d&lsquo;intérêt public ou relevant de
          l&lsquo;exercice de l&lsquo;autorité publique dont est investi le
          responsable de traitement au sens de l&lsquo;article 6-e du
          règlement (UE) 2016/679 du Parlement européen et du Conseil du 27
          avril 2016 relatif à la protection des personnes physiques à
          l&lsquo;égard du traitement des données à caractère personnel et à
          la libre circulation de ces données.
        </p>
        <Title as="h3" look="h6">
          Données relatives aux séances
        </Title>
        <p>
          Ce traitement de données est nécessaire à l&lsquo;exercice
          d&lsquo;une mission d&lsquo;intérêt public ou relevant de
          l&lsquo;exercice de l&lsquo;autorité publique dont est investi le
          responsable de traitement au sens de l&lsquo;article 6-e du
          règlement (UE) 2016/679 du Parlement européen et du Conseil du 27
          avril 2016 relatif à la protection des personnes physiques à
          l&lsquo;égard du traitement des données à caractère personnel et à
          la libre circulation de ces données.
        </p>
        <Title as="h3" look="h6">
          Données de contact
        </Title>
        <p>
          Ce traitement de données est nécessaire à l&lsquo;exercice
          d&lsquo;une mission d&lsquo;intérêt public ou relevant de
          l&lsquo;exercice de l&lsquo;autorité publique dont est investi le
          responsable de traitement au sens de l&lsquo;article 6-e du
          règlement (UE) 2016/679 du Parlement européen et du Conseil du 27
          avril 2016 relatif à la protection des personnes physiques à
          l&lsquo;égard du traitement des données à caractère personnel et à
          la libre circulation de ces données.
        </p>
        <Title as="h3" look="h6">
          Données de connexion
        </Title>
        <p>
          Ce traitement est nécessaire au respect d&lsquo;une obligation légale à
          laquelle le responsable de traitement est soumis au sens de
          l&lsquo;article 6-c du Règlement (UE) 2016/679 du Parlement européen et du
          Conseil du 27 avril 2016 relatif à la protection des personnes
          physiques à l&lsquo;égard du traitement des données à caractère personnel
          et à la libre circulation de ces données.
        </p>
        <p>
          L&lsquo;obligation légale est posée par la loi LCEN n° 2004-575 du 21 juin 2004 pour la confiance
          dans l&lsquo;économie numérique et par les articles 1 et 3 du décret n°2011-219 du 25 février 2011.
        </p>
        <Title as="h3" look="h6">
          Cookies
        </Title>
        <p>
          En application de l&lsquo;article 5(3) de la directive 2002/58/CE
          modifiée concernant le traitement des données à caractère personnel
          et la protection de la vie privée dans le secteur des communications
          électroniques, transposée à l&lsquo;article 82 de la loi n°78-17 du
          6 janvier 1978 relative à l&lsquo;informatique, aux fichiers et aux
          libertés, les traceurs ou cookies suivent deux régimes distincts.
        </p>
        <p>
          Les cookies strictement nécessaires au service ou ayant pour
          finalité exclusive de faciliter la communication par voie
          électronique sont dispensés de consentement préalable au titre de
          l&lsquo;article 82 de la loi n°78-17 du 6 janvier 1978.
        </p>
        <p>
          Les cookies
          n&lsquo;étant pas strictement nécessaires au service ou
          n&lsquo;ayant pas pour finalité exclusive de faciliter la
          communication par voie électronique doivent être consenti par
          l&lsquo;utilisateur.
        </p>
        <p>
          Ce consentement de la personne concernée pour
          une ou plusieurs finalités spécifiques constitue une base légale au
          sens du RGPD et doit être entendu au sens de l&lsquo;article 6-a du
          Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27
          avril 2016 relatif à la protection des personnes physiques à l&lsquo;égard
          du traitement des données à caractère personnel et à la libre
          circulation de ces données.
        </p>
        <p>
          En l&lsquo;occurrence Santé Psy Etudiant
          n&lsquo;utilise pas de cookies nécessitant le consentement. En
          effet, l&lsquo;outil utilisé est Matomo, un outil libre, paramétré
          pour être en conformité avec la recommandation &laquo; Cookies &raquo; de la
          CNIL.
        </p>
      </Section>
      <Section title="Durée de conservation">
        <p>Les données à caractère personnel sont conservées :</p>
        <SimpleTable data={dataConservation} />
      </Section>
      <Section title="Droit des personnes concernées">
        <p>
          Selon la loi n° 78-17 du 6 janvier 1978 relative à l&lsquo;informatique
          aux fichiers et aux libertés, vous disposez des droits suivants
          concernant vos données à caractère personnel :
        </p>
        <ul className="fr-list">
          <li>
            Droit d&lsquo;information et droit d&lsquo;accès aux données ;
          </li>
          <li>
            Droit de rectification et le cas échéant de suppression des
            données ;
          </li>
          <li>
            Droit au retrait du consentement en matière de cookies uniquement
            s&lsquo;il y a des cookies nécessitant le consentement.
          </li>
        </ul>
        <p>
          Pour les exercer, faites-nous parvenir une demande en précisant la
          date et l&lsquo;heure précise de la requête – ces éléments sont
          indispensables pour nous permettre de retrouver votre recherche –à
          l&lsquo;adresse suivante :
        </p>
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
            href="https://santepsy.etudiant.gouv.fr/contact"
            target="_blank"
            rel="noreferrer"
          >
            santepsy.etudiant.gouv.fr/contact
          </a>
          {' '}
        </p>
        <p>Par voie postale :</p>
        <p>
          A l&lsquo;attention du ou de la Chargé(e) de mission sur le
          dispositif Santé Psy Etudiant
          <br />
          Sous-direction de la vie étudiante - DGESIP A2
          <br />
          1 rue Descartes
          <br />
          75005 Paris
        </p>
        <p>
          En raison de l&lsquo;obligation de sécurité et de confidentialité
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
          Vous avez la possibilité de vous opposer à un traitement de vos
          données personnelles. Pour vous aider dans votre démarche, vous
          trouverez
          {' '}
          <a
            href="https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-inexactes-obsoletes-ou-perimees"
            target="_blank"
            rel="noreferrer"
          >
            ici
          </a>
          {' '}
          un modèle de courrier élaboré par la Cnil.
        </p>
        <p>
          Le responsable de traitement s&lsquo;engage à répondre dans un délai
          raisonnable qui ne saurait dépasser 1 mois à compter de la réception
          de votre demande.
        </p>
      </Section>
      <Section title="Destinataire des données">
        <p>
          Le responsable de traitement s&lsquo;engage à ce que les données à
          caractères personnels soient traitées par les seules personnes
          autorisées.
        </p>
      </Section>
      <Section title="Sous-traitants">
        <p>
          Certaines des données sont envoyées à des sous-traitants pour
          réaliser certaines missions. Le responsable de traitement s&lsquo;est
          assuré de la mise en œuvre par ses sous-traitants de garanties
          adéquates et du respect de conditions strictes de confidentialité,
          d&lsquo;usage et de protection des données.
        </p>
        <SimpleTable data={dataSubcontractor} />
      </Section>
      <Section title="Sécurité et confidentialité des données">
        <p>
          Le responsable de traitements prend les mesures techniques et
          opérationnelles nécessaires afin d&lsquo;assurer la sécurité et la
          confidentialité des données telles que le chiffrement et le
          cloisonnement des accès. Des audits et analyses de code sont
          également effectuées.
        </p>
        <p>
          En ce sens les données introduites par le psychologue pour générer
          la facture sont collectées localement, de ce fait elles ne sont pas
          traitées par Santé Psy Etudiant.
        </p>
      </Section>
      <Section title="Utilisation de témoins de connexion (&laquo; cookies &raquo;)">
        <p>
          Un cookie est un fichier déposé sur votre terminal lors de la visite
          d&lsquo;un site. Il a pour but de collecter des informations
          relatives à votre navigation et de vous adresser des services
          adaptés à votre terminal (ordinateur, mobile ou tablette).
        </p>
        <p>
          Nous collectons donc des données par l&lsquo;intermédiaire de
          dispositifs appelés “cookies” permettant d&lsquo;établir des mesures
          statistiques.
        </p>
        <p>
          Le site dépose des cookies de mesure d&lsquo;audience (nombre de
          visites, pages consultées), respectant les conditions
          d&lsquo;exemption du consentement de l&lsquo;internaute définies par
          la recommandation &laquo; Cookies &raquo; de la Commission nationale
          informatique et libertés (CNIL). Cela signifie, notamment, que ces
          cookies ne servent qu&lsquo;à la production de statistiques anonymes
          et ne permettent pas de suivre la navigation de l&lsquo;internaute
          sur d&lsquo;autres sites. Le site dépose également des cookies de
          navigation, aux fins strictement techniques, qui ne sont pas
          conservés. La consultation du site n&lsquo;est pas affectée lorsque
          les utilisateurs utilisent des navigateurs désactivant les cookies.
        </p>
        <p>
          <strong>
            Nous utilisons pour cela
            {' '}
            <a href="https://matomo.org/" target="_blank" rel="noopener noreferrer">Matomo</a>
          </strong>
          , un outil de mesure d&lsquo;audience web
          {' '}
          <a href="https://matomo.org/free-software/" target="_blank" rel="noopener noreferrer">libre</a>
          , paramétré pour être en conformité avec la
          {' '}
          <a href="https://www.cnil.fr/fr/solutions-pour-la-mesure-daudience" target="_blank" rel="noopener noreferrer">recommandation « Cookies »</a>
          {' '}
          de la
          {' '}
          <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr>
          .
          Cela signifie que votre adresse IP, par
          exemple, est anonymisée avant d&lsquo;être enregistrée. Il est donc
          impossible d&lsquo;associer vos visites sur ce site à votre
          personne. Il convient d&lsquo;indiquer que :
        </p>
        <ul className="fr-list">
          <li>
            Les données collectées ne sont pas recoupées avec d&lsquo;autres
            traitements.
          </li>
          <li>
            Les cookies ne permettent pas de suivre la navigation de
            l&lsquo;internaute sur d&lsquo;autres sites.
          </li>
        </ul>
        <p>
          Pour refuser les cookies de Matomo directement sur notre
          plateforme :
        </p>
        <iframe
          title="stats"
          style={{ border: 0, height: 120, width: '100%' }}
          src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=&fontSize=&fontFamily=%22Marianne%22%2C%20arial%2C%20sans-serif"
        />
        <p>
          À tout moment, vous pouvez refuser l&lsquo;utilisation des cookies
          et désactiver le dépôt sur votre ordinateur en utilisant la fonction
          dédiée de votre navigateur (fonction disponible notamment sur
          Microsoft Internet Explorer 11, Google Chrome, Mozilla Firefox,
          Apple Safari et Opera).
        </p>
        <p>
          Pour aller plus loin, vous pouvez consulter les fiches proposées par
          la Commission Nationale de l&lsquo;Informatique et des Libertés
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
      <Section title="Je contribue à enrichir vos données, puis-je y accéder ?">
        <p>
          Bien sûr ! Les statistiques d’usage sont disponibles en accès libre sur
          {' '}
          <a target="_blank" rel="noopener noreferrer" href="https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&date=yesterday&period=day&idSite=160#?idSite=160&period=day&date=yesterday&segment=&category=Dashboard_Dashboard&subcategory=1">stats.data.gouv.fr</a>
          .
        </p>
      </Section>
    </Page>
  );
};

export default PrivacyPolicy;
