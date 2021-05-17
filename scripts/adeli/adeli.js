const { exec } = require('child_process');

const execShellCommand = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.warn(error);
    }
    resolve(stdout || stderr);
  });
});

const match = (input, result) => {
  if (!input) return true;
  const inputWithoutSpace = input.replace(' ', '');
  return inputWithoutSpace.localeCompare(result, undefined, { sensitivity: 'base' }) === 0;
};

const checkAdeli = async (adeli, firstname, lastname, profession) => {
  if (!adeli) {
    console.log("Le numéro ADELI n'est pas renseigné ou mal formaté");
    return false;
  }

  const result = await execShellCommand(`./scripts/adeli/adeli.bash ${adeli}`);
  try {
    const resultJson = JSON.parse(result);
    if (!resultJson.exists) {
      console.log('Le numéro ADELI est introuvable');
      return false;
    }
    if (!match(firstname, resultJson.firstname)
    || !match(lastname, resultJson.lastname)
    || !match(profession, resultJson.profession)) {
      console.log('Le numéro ADELI existe mais ne correspond pas aux informations saisies');
      return false;
    }

    console.debug('Le numéro ADELI est valide et correspond aux informations saisies');
    return true;
  } catch (err) {
    console.error("Une erreur s'est produite lors de la vérification du numéro ADELI", err);
  }

  return false;
};

/*
  To run it : 
  `chmod +v ./scripts/adeli/adeli.bash`
  `node ./scripts/adeli/adeli.js [adeli] [firstname] [lastname] [profession]`

  To speed up the process, update adeli.bash to set KEEP_ARCHIVE=true (IN DEV ONLY)
*/
checkAdeli(process.argv[2], process.argv[3], process.argv[4], process.argv[5])
  .then(() => process.exit(0))
  .catch((error) => console.log(`An error occurred ${error}`));
