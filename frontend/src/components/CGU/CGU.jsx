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
          La Plateforme est libre d’accès, elle est à destination des étudiants et psychologues conventionnés par
          les Universités. L’utilisation de la Plateforme vaut acceptation des présentes CGU.
        </p>
        <p>
          Elle est à l’initiative de l’Incubateur de services numériques de la Direction interministérielle du
          numérique (DINUM), (ci-après dénommé « l’éditeur »).
        </p>
      </Section>
      <Section title="Article 2 - Objet">
        <p>
          « Santé Psy Étudiant » vise à mettre en relation étudiants et psychologues afin de permettre la
          réalisation de séances gratuites, en application des annonces du Président de la République et du
          Premier Ministre, le Ministère de l’Enseignement Supérieur, de la Recherche et de l’Espace (MESRE)
          pour le déploiement d’un ensemble de mesures destinées à soutenir psychologiquement les étudiants au
          cours de l’année 2021.
        </p>
        <p>
          Le dispositif Santé Psy Étudiant est entièrement gratuit pour les étudiants qui n’ont à avancer aucun
          frais. Les psychologues partenaires sont remboursés par les universités partenaires suite aux conventions
          signées.
        </p>
      </Section>
      <Section title="Article 3 – Définitions">
        <p>
          L’ « Utilisateur » est toute personne utilisant la Plateforme, qui peut être un étudiant, un médecin, ou
          un psychologue.
        </p>
        <p>Les « Services » sont l’ensemble des services proposés par Santé Psy Étudiant.</p>
        <p>
          Le « responsable de traitement » : est la personne qui, au sens de l’article du règlement (UE) n°2016/679
          du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à du
          traitement des données à caractère personnel et à la libre circulation de ces données à caractère
          personnel.
        </p>
      </Section>
      <Section title="Article 4- Fonctionnalités générales">
        <Title as="h3" look="h5">4.1 Trouver un psychologue</Title>
        <p>
          Tout Utilisateur peut au travers de la Plateforme consulter la liste de psychologues référencés et
          effectuer des recherches par nom, ville, code postal ou région.
        </p>
        <p>
          Muni de sa carte étudiant ou de son certificat de scolarité pour l&apos;année en cours, l’Utilisateur étudiant a le droit à 12 séances.
          Il peut prendre rendez-vous avec un des psychologues référencés en contactant le professionnel au
          travers des moyens de contact renseignés sur le référentiel.
        </p>
        <Title as="h3" look="h5">4.2 Changer de psychologue</Title>
        <p>
          Dans le cadre du dispositif, il est possible à tout moment changer de psychologue dans la liste de nos
          psychologues partenaires.
        </p>
      </Section>
      <Section title="Article 5 - Fonctionnalités réservées aux Utilisateurs psychologues">
        <p>
          Les psychologues partenaires du dispositif sont agréés par les services de santé étudiante (SSE) et
          signent une convention avec l’établissement dont dépend le SSE qui les a agréés. Cette convention précise
          les modalités de paiement des séances réalisées dans le cadre du dispositif.
        </p>
        <p>
          Les psychologues doivent signer une convention avec une Université partenaire préalablement à leur
          inscription afin de pouvoir se voir rembourser les séances effectuées au travers de Santé Psy Etudiant.
        </p>
        <Title as="h3" look="h5">5.1 Inscription au travers de « démarches simplifiées »</Title>
        <p>
          Pour participer au dispositif Santé Psy Étudiant, les psychologues doivent obligatoirement en faire la
          demande en renseignant un formulaire au travers de « démarches simplifiées » (
          <a
            href={config.demarchesSimplifieesUrl}
            target="_blank"
            rel="noreferrer"
          >
            cliquez ici pour accéder au formulaire
          </a>
          ). Le service de santé étudiante (SSE) le plus proche du lieu d’exercice procédera à
          l’examen de la demande.
        </p>
        <p>
          Si elle est conforme aux critères retenus, la demande sera agréée et le psychologue sera invité(e) à
          signer une convention avec l’université à laquelle le SSE est rattaché. Les coordonnées seront publiées
          sur la liste des psychologues participant au dispositif. Les étudiants orientés, par le SSE ou un médecin
          généraliste, vers un psychologue choisiront parmi celles et ceux inscrits sur cette liste et prendront
          directement rendez-vous avec celle ou celui qu’ils ont choisi(e).
        </p>
        <p>L’Utilisateur psychologue dispose ensuite d’un espace dédié sur la Plateforme Santé Psy Etudiant.</p>
        <Title as="h3" look="h5">5.2 Suivi des séances</Title>
        <p>En accédant à leur espace, les psychologues partenaires du dispositif déclarent leur nombre de séances.</p>
        <p>
          Cette déclaration va déclencher les opérations de paiement prises en charge par les services
          administratifs et financiers de l’établissement, dans le respect du secret médical et professionnel. Le
          paiement intervient dans le délai global de paiement, soit 30 jours à partir du moment où les pièces
          justificatives du paiement sont réunies.
        </p>
        <p>
          Le remboursement nécessite la signature de la convention avec l’Université partenaire, qui contient les
          modalités de facturation (numéro de bon de commande si nécessaire, mode d’envoi etc.).
        </p>
        <Title as="h3" look="h5">5.3 Générateur de factures</Title>
        <p>
          Santé Psy Etudiant met à disposition de l’Utilisateur un générateur de factures afin de faciliter le
          remboursement des séances. Les données insérées sont enregistrées en local sur la machine de
          l’Utilisateur, en ce sens aucune donnée est remontée à Santé Psy Etudiant qui ne peut assurer la véracité
          de la facture.
        </p>
        <p>
          Toute véracité de la facture générée au travers de l’outil mis à disposition reste ainsi de la
          responsabilité de l’Utilisateur, et tout remboursement reste de la responsabilité de l’Université
          partenaire.
        </p>
        <Title as="h3" look="h5">5.4 Retrait du dispositif</Title>
        <p>
          Pour être retiré du dispositif Santé Psy Étudiant, rendez-vous dans votre espace psychologue sur la page
          « Mes Informations » et cliquez sur « Retirez mes informations de l&lsquo;annuaire » en bas de la page.
          Vous pouvez également choisir depuis l’espace psychologue de vous retirer définitivement du dispositif.
        </p>
      </Section>
      <Section title="Article 6 - Responsabilités">
        <Title as="h3" look="h5">6.1 L’éditeur du Site</Title>
        <p>
          Les sources des informations diffusées sur l’application sont réputées fiables mais Santé Psy Etudiant ne
          garantit pas qu’il soit exempt de défauts, d’erreurs ou d’omissions.
        </p>
        <p>
          Tout événement dû à un cas de force majeure ayant pour conséquence un dysfonctionnement du site et sous
          réserve de toute interruption ou modification en cas de maintenance, n&lsquo;engage pas la responsabilité
          de l’éditeur.
        </p>
        <p>
          L’éditeur s’engage à mettre en œuvre toutes mesures appropriées, afin de protéger les données traitées.
        </p>
        <p>
          L’éditeur s’engage à la sécurisation du site, notamment en prenant les mesures nécessaires permettant de
          garantir la sécurité et la confidentialité des informations fournies.
        </p>
        <p>
          L’éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu, sans contrepartie
          financière, à la Plateforme. Il se réserve la liberté de faire évoluer, de modifier ou de suspendre, sans
          préavis, la Plateforme pour des raisons de maintenance ou pour tout autre motif jugé nécessaire.
        </p>
        <p>
          Conformément à la
          {' '}
          <a
            href="https://services.dgesip.fr/fichiers/CirculaireMesuresAccompagnementPsychologues-Tests-15fev21.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Circulaire
          </a>
          {' '}
          du 15 février 2021, la Plateforme ne prend pas en charge les remboursements
          qui sont de la responsabilité des universités partenaires dans le cadre de la convention signée entre
          elles et psychologues.
        </p>
        <Title as="h3" look="h5">6.2 L’Utilisateur</Title>
        <p>
          Il est rappelé que toute personne procédant à une fausse déclaration pour elle-même ou pour autrui
          s’expose, notamment, aux sanctions prévues à l’article 441-1 du code pénal, prévoyant des peines pouvant
          aller jusqu’à trois ans d’emprisonnement et 45 000 euros d’amende.
        </p>
        <p>
          En ce sens, toute information transmise par l&lsquo;Utilisateur est de sa seule responsabilité, notamment
          concernant le nombre de séances réalisées et les informations transmises pour sa facture.
        </p>
        <p>
          L’Utilisateur s’engage à s’assurer de la confidentialité de ses identifiants, et éviter toute imprudence
          pouvant favoriser un usage frauduleux du dispositif. Il s’engage à prévenir immédiatement l’éditeur de
          toute utilisation non autorisée de son compte ou de ses informations.
        </p>
      </Section>
      <Section title="Article 7 - Non-respect des CGU">
        <p>
          En cas de non-respect des présentes CGU, l’éditeur s’autorise à suspendre ou révoquer n&lsquo;importe
          quel compte et toutes les actions réalisées par ce biais, s’il estime que l’usage réalisé du Service porte
          préjudice à son image ou ne correspond pas aux exigences de sécurité.
        </p>
      </Section>
      <Section title="Article 8 - Mise à jour des conditions d’utilisation">
        <p>
          Les termes des présentes conditions d’utilisation peuvent être amendés à tout moment, sans préavis, en
          fonction des modifications apportées à la Plateforme, de l’évolution de la législation ou pour tout autre
          motif jugé nécessaire. Les modifications s‘imposent à l’Utilisateur.
        </p>
      </Section>
      <Section title="Article 9 – Contact">
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
