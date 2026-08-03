export const validateEmailFormat = email => String(email)
  .toLowerCase()
  .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );


export const validateEmailField = (email, setEmailError) => {
  const isValidEmail = validateEmailFormat(email);
  if (!isValidEmail) {
    setEmailError("Format incorrect de l'email.");
    return false;
  }
  if (email.toLowerCase().includes('santepsyetudiant')) {
    setEmailError(
      "Cette adresse email n'est pas autorisée à créer un compte étudiant.",
    );
    return false;
  }
  setEmailError('');
  return true;
}
