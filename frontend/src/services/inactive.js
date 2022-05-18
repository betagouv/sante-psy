const baseMessage = 'En cette période d\'examens, les demandes d\'étudiants sont en constante augmentation, nous sollicitons donc votre participation.';

// eslint-disable-next-line import/prefer-default-export
export const getInactiveMessage = user => {
  switch (user.inactiveReason) {
    case 'holidays':
      return `${baseMessage} Si vous êtes revenu de vacances, pensez à réactiver votre profil sur la page`;
    case 'toofew':
      return `${baseMessage} Pour recevoir de nouvelles demandes pensez à réactiver votre profil sur la page`;
    case 'toomuch':
      return 'Si vous avez un peu plus de temps désormais, vous pouvez réactiver votre profil sur la page';
    case 'connection':
      return 'Notre équipe travaille afin d\'améliorer le site. Pour tester les améliorations, nous vous invitons à réactiver votre profil depuis la page';
    case 'disagree':
      return `${baseMessage} Si vous avez changé d'avis sur le dispositif et voulez de nouveau aider des étudiants, réactivez votre profil sur la page`;
    case 'reimbursments':
      return `${baseMessage} Si votre université a effectué vos remboursements et que vous souhaitez de nouveau participer au dispositif, pensez à réactiver votre profil sur la page`;
    case 'convention':
      return `${baseMessage} Si votre conventionnement est désormais effectué, pensez à réactiver votre profil sur la page`;
    default:
      return `${baseMessage} Pour que les étudiants puissent vous contacter, rendez vous sur la page`;
  }
};
