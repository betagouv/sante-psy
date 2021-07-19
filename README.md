# Santé Psy | https://santepsyetudiants.beta.gouv.fr/
CI branche `main` :  ![image](https://github.com/betagouv/sante-psy/workflows/Node.js%20CI/badge.svg)
## Lancer en prod
Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.

Le deploiement sur scalingo se base sur le fichier [`Procfile`](https://doc.scalingo.com/platform/app/procfile)

    $ npm start


## Lancer ce site localement
Vous devez avoir npm et docker compose installés sur votre machine.

```bash
git clone https://github.com/betagouv/sante-psy
cd sante-psy
cp .env.sample .env # replace API_TOKEN from Demarches Simplifiees API
docker-compose up
# http://localhost:8080 is ready with some test data to plat with
# to access psy workspace with toy data use this email login@beta.gouv.fr
# to access psy workspace without data use this email empty@beta.gouv.fr
# all available emails are listed here /test/seed/fake_data.js
# http://localhost:3000/psychologue/login
# login emails are received here : http://localhost:1080/
```

Pour controler visuellement la base de données, nous conseillons :
* https://dbeaver.io/download/


## Afficher des annonces
Pour afficher des annonces de service (maintenance, formulaire, ...), on utilise la variable d'environnement `ANNOUNCEMENT` (voir .env.sample ou le fichier docker-compose) qui peut être configurée sur l'hebergeur Scalingo. Elle permet d'afficher de l'HTML ou du texte.


### Pour tester les évolutions de base de données

#### Créer un fichier de migration

    $ npm run makeMigration migration-name

#### Importer des fausses données
Voir les fichiers dans `test/seed` qui vont cleaner la base puis créer quelques universités, psychologues, patients, et séances.

Pour l'exécuter:

    $ npm run seed

#### Upload un fichier sur Scalingo
Attention, le fichier sera supprimé après la déconnexion ! Si tu as besoin d'un fichier permanent sur scalingo, il faut passer par le repo git.

```
# ça va importer ton fichier sur la machine et te connecter
scalingo -app APP_NAME run --file <nom_de_ton_fichier> bash
> cp /tmp/uploads/<nom_de_ton_fichier> .
```

#### Executer un cron manuellement
```
scalingo -app APP_NAME run bash
> node dist/cron_jobs/launch.js <nom_du_job>
```

#### Ajout de la correspondance entre université et psychologues
```
# handle special cases - need to update the confidential list inside "scripts/psyToUni.js"
# you can use `--dry-run` option to display the changes without applying them
> ts-node -r tsconfig-paths/register scripts/matchSpecialPsyToUniversities.ts [--dry-run]
```

#### Insérer les universités pour la production
Voir aussi le script "scaling-dev-seed.sh" lié à "scalingo.json" qui permet d'insérer ces données sur les reviews app lors de leur 1er deploiement.

```bash
node scripts/insertUniversities.js # Insert into universities tables
node scripts/insertEmailToUniversities.js test/seed/test-ssu-renew.csv # insert emails contacts from CSV files (need to ask support for rights)
```

#### Exécuter les migrations
```bash
# Pour mettre à jour la base de données.
# Voir la doc https://knexjs.org/#Migrations-make pour plus d'options.
npm run migrate
```

### Les données
Pour afficher une liste de psychologues, nous importons les données venant de l'API démarches simplifiées (DS) dans la base de données Postgresql à l'aide d'un cron. Cela nous permet un meilleur taux de réponses et une maitrise en cas de pic de traffic.


L'API DS est appellée à intervalle regulier à l'aide d'un CRON pour mettre à jour la table PG `psychologists` et on stockera le dernier `cursor` qui correspond à la dernière page requête de l'API dans la table PG `ds_api_cursor` pour ne rappeller que les pages necessaires et limiter le nombre d'appel à l'API DS.

Cependant, certaines données dans DS vont être modifiées au fil du temps, et il nous est donc obligatoire de mettre à jour toutes les données, dans ce cas là nous n'utilisons pas le `cursor` de l'API à l'aide d'un 2ème CRON moins fréquent.

API de démarches simplifiées :
* Documentation : https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/graphql
* Schema: https://demarches-simplifiees-graphql.netlify.app/query.doc.html

Pour mettre à jour toutes les données venant de DS vers PG, un cron est lancé à intervalle régulier (voir la page containers de Scalingo) :

    $ node ./cron_jobs/cron.js


#### Accès à postgres
Avec [le scalingo CLI](https://doc.scalingo.com/cli) et le nom de l'app sur scalingo

    $ scalingo -a APP_NAME pgsql-console

On peut insérer des données comme ceci :
```sql
INSERT INTO public.psychologists
("dossierNumber", adeli, "firstNames", "lastName", email, address, departement, region, phone, website, teleconsultation, description, languages, training, diploma, "createdAt", "updatedAt", archived, state, "personalEmail")
VALUES('77356ab0-349b-4980-899f-bad2ce87e2f1', 'adeli', 'firstname', 'lastname', 'publicemail@beta.gouv.fr', '', '', '', '', '', false, 'accfzfz', '', '[]', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'accepte', 'private.email@beta.gouv.fr');
```

Autre solution : utiliser le code Node au lieu de SQL.

    $ scalingo -a APP_NAME run node

Puis une fois la console node ouverte :
```js
const dbPsychologists = require('./db/psychologists')

let psy = { 'dossierNumber': '77356ab0-349b-4980-899f-bad2ce87e2f1', 'adeli': 123, firstNames: 'Stevie', 'lastName': 'Wonder', 'email': 'meetwithstevie@wonder.com', archived: true, state: 'accepte', personalEmail: 'stevie@wonder.com'}

dbPsychologists.savePsychologistInPG([psy])
```

### Test
#### Back
Pour utiliser le container Postgresql
```bash
# Start DB and build SQL tables
docker-compose -f docker-compose-only-db.yml up

# start tests
npm test
```
#### Front
Une fois l'appli lancée normalement, on utilise cypress
```bash
docker-compose up

cd frontend
npm run cy:run
```

#### .ENV

##### Secrets
Penser à décommenter les variables d'environnement `SECRET` et `SECRET_LOGS` dans le fichier `.env` avant de lancer les tests localement.

#### Tester uniquement un test

    $ npm test -- --grep "should call batchInsert on PG"

#### Code coverage

    $ npm run coverage


Ensuite, visiter avec votre navigateur pour visualiser le dossier `./coverage` :
*  $REPO_PATH/sante-psy/coverage/index.html

### Les emails - serveur SMTP Maildev
[Maildev](http://maildev.github.io/maildev/) est un serveur SMTP avec une interface web conçus pour le développement et les tests.

Sans docker: Une fois installé et lancé, il suffit de mettre la variable d'environnement MAIL_SERVICE à maildev pour l'utiliser. MAIL_USER et MAIL_PASS ne sont pas nécessaires.

Avec docker: ne pas préciser de MAIL_SERVICE, les bonnes variables d'environnement sont déjà précisées dans le docker-compose

Tous les emails envoyés par le code seront visibles depuis l'interface web de Maildev :
* http://localhost:1080/
### Lint

    $ npm run lint

### Variables d'environnement
Voir `.env.sample` pour la liste complète

### Libraries
* https://github.com/prisma-labs/graphql-request
Tester les fonctions privées :
* https://github.com/jhnns/rewire
