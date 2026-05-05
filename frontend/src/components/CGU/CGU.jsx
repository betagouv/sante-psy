import React from 'react';
import { Link } from 'react-router-dom';
import { Title } from '@dataesr/react-dsfr';
import { useStore } from 'stores/';

import Page from 'components/Page/Page';
import Section from 'components/Page/Section';

const CGU = () => {
  const { commonStore: { config } } = useStore();
  return (
    <Page
      title="Conditions Générales d’Utilisation"
      withoutHeader
      textContent
    >
      <h1 className="secondaryPageTitle">Conditions Générales d’Utilisation</h1>
      <p>
        Les présentes conditions générales d’utilisation (dites « CGU ») fixent le cadre juridique du dispositif
        « Santé Psy Étudiant » définissent les conditions d’accès et d’utilisation des services par l’Utilisateur.
      </p>
      <Section title="Article 1 - Champ d’application">
        <p>
          Les présentes conditions générales d’utilisation (ci-après “CGU”) précisent le cadre juridique
          du dispositif « Santé Psy Étudiant » (ci-après la “Plateforme”) et définissent les conditions
          d’accès et d’utilisation des Services par le Psychologue et l’Étudiant.
        </p>
        <p>
          La Plateforme est un service public numérique, sous la responsabilité du ministère de
          l’Enseignement supérieur et de la Recherche et de l’Espace (MESRE), à destination des
          étudiants disposant d’un INE valide et des psychologues conventionnés par les universités
          en lien avec le service universitaire de santé étudiante.
        </p>
      </Section>
      <Section title="Article 2 - Objet de la Plateforme">
        <p>
          « Santé Psy Étudiant » vise à mettre en relation étudiants et psychologues - via un annuaire
          afin de permettre la réalisation de consultations gratuites, en application des annonces du
          Président de la République et du Premier Ministre. Le MESRE (ci-après “Éditeur“) a déployé
          le dispositif dans le but d’accompagner les étudiants depuis 2021 sur les enjeux de santé mentale.
        </p>
        <p>
          Le dispositif Santé Psy Étudiant est entièrement gratuit pour les étudiants qui n’ont à avancer
          aucun frais. Les psychologues et les universités ont signé une convention notamment pour
          encadrer la bonne utilisation du dispositif et le remboursement des séances.
        </p>
        <p>
          Santé Psy Étudiant permet aux psychologues et aux étudiants de bénéficier d’espaces
          personnels notamment pour le suivi des séances et la gestion de la facturation.
        </p>
      </Section>
      <Section title="Article 3 – Définitions">
        <p>
          “Éditeur” désigne la personne morale qui met à la disposition du public la Plateforme, à
          savoir le MESRE.
        </p>
        <p>
          “Plateforme” désigne le service numérique qui permet aux étudiants de trouver un
          psychologue dans l’annuaire, de gérer leur espace personnel et aux psychologues de déclarer
          leurs séances et gérer la facturation.
        </p>
        <p>
          “Services” désigne les fonctionnalités proposées par la Plateforme pour répondre à ces
          finalités
        </p>
        <p>
          “Psychologue” désigne toute personne physique, qui exerce la profession de psychologue, qui
          s’inscrit sur la Plateforme pour recenser les séances réalisées et gérer la facturation.
        </p>
        <p>
          « Étudiant » désigne toute personne physique, étudiant de l’Enseignement Supérieur qui
          s’inscrit sur la Plateforme et répond aux critères d’éligibilité de la Plateforme (numéro INE
          valide).
        </p>
      </Section>
      <Section title="Article 4 - Fonctionnalités réservées aux Psychologues">
        <p>
          Les Psychologues Utilisateurs du dispositif sont agréés par les services universitaires de santé étudiante
          (SSE) et signent une convention avec l’établissement dont dépend le SSE qui les a agréés.
          Cette convention, signée entre le Psychologue et l’université, précise notamment les
          modalités de déclaration / paiement des séances réalisées dans le cadre du dispositif.
        </p>
        <Title as="h3" look="h5">4.1 Inscription via « démarches simplifiées »</Title>
        <p>
          Pour participer au dispositif Santé Psy Étudiant, les Psychologues doivent obligatoirement en
          faire la demande en renseignant un formulaire par le biais de « démarche numérique » (
          <a
            href={config.demarchesSimplifieesUrl}
            target="_blank"
            rel="noreferrer"
          >
            cliquez ici pour accéder au formulaire
          </a>
          ). Le service de santé étudiante (SSE) le plus proche
          du lieu d’exercice procédera à l’examen de la demande.
        </p>
        <p>
          Si elle est conforme aux critères retenus, la demande sera agréée et le Psychologue sera
          invité(e) à signer une convention avec l’université de rattachement du SSE. Les coordonnées
          du Psychologue seront publiées sur l’annuaire de la Plateforme SPE. Les Étudiants peuvent
          choisir parmi cette liste pour prendre un rendez-vous.
        </p>
        <Title as="h3" look="h5">4.2 Espace Psychologue</Title>
        <p>Le Psychologue dispose d’un espace dédié sur la Plateforme incluant</p>
        <ul>
          <li>un tableau de bord avec ses informations personnelle, le statut de sa convention</li>
          <li>
            les informations en lien avec sa profession (adresse du cabinet, département,
            téléphone du secrétariat, etc.) ainsi que sa disponibilité sur l’annuaire qu’il peut
            modifier
          </li>
          <li>un module de déclaration de séances et d’édition de factures</li>
        </ul>
        <p>
          Le remboursement nécessite la signature de la convention avec l’Université partenaire, qui
          contient les modalités de facturation (numéro de bon de commande si nécessaire, mode
          d’envoi etc.). Un psychologue non conventionné ne peut déclarer des séances et être
          remboursé au titre du dispositif SPE.
        </p>
        <Title as="h3" look="h5">4.3 Générateur de factures</Title>
        <p>
          La Plateforme met à disposition du Psychologue un générateur de factures afin de faciliter le
          remboursement des séances. Le Psychologue peut sélectionner le mois de facturation et
          télécharger les factures correspondantes ou les imprimer. Il peut également modifier ses
          données de facturation (SIRET, IBAN, Bon de commande).
        </p>
        <p>
          Les données insérées sont enregistrées en local sur l’appareil du Psychologue. En ce sens
          aucune donnée est remontée à la Plateforme qui ne peut assurer la véracité de la facture.
        </p>
        <p>
          Toute véracité de la facture générée au travers de l’outil mis à disposition reste ainsi de la
          responsabilité du Psychologue, et tout remboursement reste de la responsabilité de
          l’Université partenaire.
        </p>
        <Title as="h3" look="h5">4.4 Retrait du dispositif</Title>
        <p>
          Pour être retiré du dispositif Santé Psy Étudiant, le Psychologue se dirige vers son espace
          psychologue sur la page « Mes Informations » et clique sur « Retirez mes informations de
          l’annuaire » en bas de la page.
        </p>
        <Title as="h3" look="h5">4.5 Suivi des Étudiants</Title>
        <p>
          Les Psychologues disposent d’une vue d’ensemble des Étudiants accompagnés avec des
          informations clés : nombre de séances par étudiant, maximum de séances atteint, total des
          séances de l’année passée et de l’année en cours.
        </p>
        <p>
          Ils ont également la possibilité d’archiver un étudiant qui n’est plus accompagné.
        </p>
        <p>
          Le Psychologue qui reçoit un nouvel Étudiant peut l’inviter à créer son espace en renseignant
          ses informations personnelles (prénom, nom, adresse courriel, numéro INE vérifié via la carte
          étudiant ou tout autre justificatif, type d’établissement, nom de l’établissement, localisation,
          niveau d’études, domaine d’études, zone géographique, genre). L’Étudiant ajouté reçoit un
          lien magique sur son adresse courriel valable pendant 48 heures.
        </p>
        <Title as="h3" look="h5">4.6 Contacter le support</Title>
        <p>
          En cas de question ou de signalement, le Psychologue peut à tout moment contacter le
          support.
        </p>
      </Section>
      <Section title="Article 5 - Fonctionnalités réservées aux Étudiants">
        <Title as="h3" look="h5">5.1 Se créer son espace personnel</Title>
        <p>
          L’Étudiant peut se créer un espace personnel en renseignant ses informations personnelles
          (prénom, nom de famille, numéro INE, date de naissance, type d’établissement, nom de
          l’établissement, localisation, niveau d’études, domaine d’études, zone géographique, genre),
          sur invitation de son Psychologue (par courriel) ou directement sur la Plateforme.
        </p>
        <p>
          Il renseigne son adresse courriel et reçoit un lien magique valable pendant 48 heures. Il
          accède ensuite à son espace en indiquant son nom, prénom, numéro INE et date de naissance.
        </p>
        <Title as="h3" look="h5">5.2 Trouver un psychologue</Title>
        <p>
          L’Étudiant peut consulter la liste des psychologues référencés par le dispositif SPE et
          effectuer des recherches par nom, ville, code postal ou région. Muni de sa carte étudiante
          ou de son certificat de scolarité pour l’année en cours, il bénéficie de douze séances par
          année universitaire. Il peut prendre rendez-vous avec un des Psychologues référencés en
          contactant le professionnel au travers des moyens de contact renseignés sur la Plateforme.
        </p>
        <Title as="h3" look="h5">5.3 Changer de Psychologue</Title>
        <p>
          Dans le cadre du dispositif, il est possible à tout moment de changer de Psychologue dans la
          liste des Psychologues partenaires de la Plateforme.
        </p>
        <Title as="h3" look="h5">5.4 Suivre son historique de séances</Title>
        <p>
          L’Étudiant peut suivre son historique de séances et son solde de séances restantes via la
          consultation de son tableau de bord dans son espace personnel.
        </p>
      </Section>
      <Section title="Article 6 - Responsabilités">
        <Title as="h3" look="h5">6.1 L’Éditeur de la Plateforme</Title>
        <p>
          Les sources des informations diffusées sur la Plateforme sont réputées fiables mais l’Éditeur
          ne garantit pas qu’elle soit exempte de défauts, d’erreurs ou d’omissions.
        </p>
        <p>
          L’Éditeur s’engage à la sécurisation de la Plateforme, notamment en prenant toutes les
          mesures nécessaires permettant de garantir la sécurité et la confidentialité des informations
          fournies. Il ne saurait être tenu responsable de tout contenu publié sur la Plateforme ou
          généré via celle-ci par le Psychologue ou l’Étudiant, notamment des fausses informations
          renseignées.
        </p>
        <p>
          En aucun cas, l’Éditeur n’est responsable des paiements ou des remboursements, ces derniers
          relèvent uniquement des modalités définies dans la convention signée entre l’université et le
          Psychologue, comme prévu par la circulaire du 10 février 2021 de la direction générale de
          l’enseignement supérieur et de l’insertion professionnelle (DGESIP).
        </p>
        <p>
          L’Éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu, sans
          contrepartie financière, à la Plateforme. Il se réserve la liberté de faire évoluer, de modifier
          ou de suspendre, sans préavis, la Plateforme pour des raisons de maintenance ou pour tout
          autre motif jugé nécessaire.
        </p>
        <p>
          En cas de manquement à une ou plusieurs des stipulations des présentes CGU ou en cas
          d’alerte par un Étudiant, un Psychologue, une université ou un SSE, l’Éditeur se réserve le
          droit de suspendre ou de supprimer le compte de l’utilisateur responsable et l’informe des
          voies et délais de recours.
        </p>
        <Title as="h3" look="h5">6.2 Le Psychologue</Title>
        <p>
          Le Psychologue s’assure de garder son lien de connexion secret. Toute divulgation du lien,
          quelle que soit sa forme, est interdite. Il assume les risques liés à l’utilisation de son adresse
          courriel.
        </p>
        <p>
          En se connectant sur la Plateforme et après acceptation des présentes CGU, le Psychologue
          certifie qu’il est un psychologue professionnel au sens de l’article 44 de la loi n° 85-772 du
          25 juillet 1985 portant diverses dispositions d’ordre social.
        </p>
        <p>
          Il est rappelé que toute personne procédant à une fausse déclaration pour elle-même ou pour
          autrui s’expose, notamment, aux sanctions prévues à l’article 441-1 du code pénal, prévoyant
          des peines pouvant aller jusqu’à trois ans d’emprisonnement et 45 000 euros d’amende.
        </p>
        <p>
          En ce sens, toute information transmise par le Psychologue est de sa seule responsabilité,
          notamment concernant le nombre de séances réalisées et les informations transmises pour sa
          facture. Il s’engage à réaliser des séances individuelles et apprécie la pertinence du recours
          à la téléconsultation.
        </p>
        <p>
          Le Psychologue s’engage à ne pas mettre en ligne de contenus ou informations contraires aux
          dispositions légales et réglementaires en vigueur. Il veille également à ne pas communiquer
          de données sensibles ou de secrets protégés par la loi à des personnes qui ne sont pas
          habilitées à en connaître.
        </p>
        <p>
          Il s’assure de bien comparer l’identité de l’Étudiant avec le certificat de scolarité et de
          vérifier que ce dernier est valable sur la période en cours.
        </p>
        <Title as="h3" look="h5">6.3 L’Étudiant</Title>
        <p>
          L’Étudiant s’assure de garder son lien de connexion secret. Toute divulgation du lien, quelle
          que soit sa forme, est interdite. Il assume les risques liés à l’utilisation de son adresse
          courriel.
        </p>
        <p>
          Il est rappelé que toute personne procédant à une fausse déclaration pour elle-même ou pour
          autrui s’expose, notamment, aux sanctions prévues à l’article 441-1 du code pénal, prévoyant
          des peines pouvant aller jusqu’à trois ans d’emprisonnement et 45 000 euros d’amende.
        </p>

        <p>
          En ce sens, toute information transmise par l’Étudiant est de sa seule responsabilité,
          notamment concernant son certificat de scolarité.
        </p>
        <p>
          L’Étudiant s’engage à ne pas mettre en ligne de contenus ou informations contraires aux
          dispositions légales et réglementaires en vigueur. Il veille également à ne pas communiquer
          de données sensibles ou de secrets protégés par la loi à des personnes qui ne sont pas
          habilitées à en connaître.
        </p>
      </Section>
      <Section title="Article 7 - Mise à jour des conditions générales d’utilisation">
        <p>
          Les termes des présentes CGU peuvent être amendés à tout moment, sans préavis, en
          fonction des modifications apportées à la Plateforme, de l’évolution de la législation ou pour
          tout autre motif jugé nécessaire.
        </p>
        <p>
          Chaque modification donne lieu à une nouvelle version qui est acceptée par le Psychologue et
          l’Étudiant.
        </p>
      </Section>
      <Section title="Article 8 – Contact">
        <p>
          En cas de problème avec le dispositif, envoyez-nous un email à
          {' '}
          <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
          {' '}
          ou contactez-nous sur
          {' '}
          <Link to="/contact">https://santepsy.etudiant.gouv.fr/contact</Link>
        </p>
        <p>
          Pour plus d’informations, nous avons également une FAQ disponible à cette adresse :
          {' '}
          <Link to="/faq">https://santepsy.etudiant.gouv.fr/faq</Link>
        </p>
      </Section>
    </Page>
  );
};

export default CGU;
