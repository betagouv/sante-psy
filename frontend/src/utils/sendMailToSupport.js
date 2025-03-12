const sendMailToSupport = (subject = '') => {
  const encodedSubject = encodeURIComponent(subject);
  const mailtoLink = `mailto:support-santepsyetudiant@beta.gouv.fr?subject=${encodedSubject}`;
  window.location.href = mailtoLink;
};

export default sendMailToSupport;
