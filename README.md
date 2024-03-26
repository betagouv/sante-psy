# Santé Psy Étudiant | <https://santepsy.etudiant.gouv.fr/>

Accompagnement psychologique pour les étudiants

![image](https://github.com/betagouv/sante-psy/workflows/Node.js%20CI/badge.svg)

## Développement

### Prérequis

* node
* npm
* docker-compose

### Installation

```bash
git clone https://github.com/betagouv/sante-psy

cd sante-psy
npm i

cd frontend
npm i
```

### Lancement en local avec docker-compose

```bash
cp .env.sample .env # remplacer les valeurs nécessaires
docker-compose up
```

Vous pouvez accéder au site sur <http://localhost:3000>.

Vous pouvez vous connecter à l'espace psy avec les emails

* login@beta.gouv.fr (compte avec des données) ou
* empty@beta.gouv.fr (compte sans données)

Vous pouvez accéder voir les emails envoyés sur <http://localhost:1080>.

### Variables d'environnement

Voir `.env.sample` pour la liste complète

### Création d'une migration

[KnexJS](http://knexjs.org/#Migrations) permet de créer des migrations de base de données. Un shortcut a été ajouté au `package.json` pour créer une migration :

```bash
npm run makeMigration <nom de la migration>
```

Une fois la migration créée, vous pouvez l'appliquer avec :

```bash
npm run migrate
```

### Import de fausses données

Voir les fichiers dans `test/seed` qui vont nettoyer la base puis créer quelques universités, psychologues, patients, et séances.

Pour l'exécuter:

```bash
npm run seed
```

### Lancement des tests

Penser à décommenter les variables d'environnement `SECRET` et `SECRET_LOGS` dans le fichier `.env` avant de lancer les tests localement.

#### Front

Une fois l'appli lancée normalement, on utilise cypress.

```bash
docker-compose up

cd frontend
npm run cy:run
```
ou

```bash
npm run cy:open
```
pour visualiser et simuler les tests sur un navigateur

#### Back

Pour lancer les tests back, on a besoin d'une base de données postgres initialisée.

```bash
docker-compose up
docker-compose stop web

npm test
```

Pour lancer uniquement un test

```bash
npm test -- --grep "should call batchInsert on PG"
```

#### Code coverage

```bash
npm run coverage
```

Ensuite, visiter avec votre navigateur pour visualiser le dossier `./coverage` :

* $REPO_PATH/sante-psy/coverage/index.html

### Serveur SMTP Maildev

[Maildev](http://maildev.github.io/maildev/) est un serveur SMTP avec une interface web conçus pour le développement et les tests.

Une fois installé et lancé, il suffit de mettre la variable d'environnement MAIL_HOST à maildev pour l'utiliser. MAIL_USER et MAIL_PASS ne sont pas nécessaires.

Tous les emails envoyés par le code seront visibles depuis l'interface web de Maildev :

* <http://localhost:1080/>

## Déploiement en production

Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.

Le deploiement sur scalingo se base sur le fichier [`Procfile`](https://doc.scalingo.com/platform/app/procfile)

```bash
npm start
```

## Actions ponctuelles sur Scalingo

### Accès à postgres

Avec [le scalingo CLI](https://doc.scalingo.com/cli) et le nom de l'app sur scalingo

```bash
scalingo -a APP_NAME pgsql-console
```

### Créer un compte psychologue de test

```sql
INSERT INTO public.psychologists
("dossierNumber", adeli, "firstNames", "lastName", email, address, departement, region, phone, website, appointmentLink, teleconsultation, description, languages, training, diploma, "createdAt", "updatedAt", archived, state, "personalEmail", "assignedUniversityId", "active")
VALUES(uuid_generate_v4(), '123456789', 'Prénom', 'Nom', 'publicemail@beta.gouv.fr', '', '', '', '', '', '', false, 'Ceci est ma description', '', '[]', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'accepte', 'prenom.nom@beta.gouv.fr', '78522ec3-7c2f-4a5d-88cd-0a6678ee0135', true);
```

### Affichage d'une annonce

Pour afficher des annonces de service (maintenance, formulaire, ...), on utilise la variable d'environnement `ANNOUNCEMENT` (voir .env.sample ou le fichier docker-compose) qui peut être configurée sur l'hébergeur Scalingo. Elle permet d'afficher de l'HTML ou du texte.

### Upload d'un fichier

Attention, le fichier sera supprimé après la déconnexion ! Si tu as besoin d'un fichier permanent sur scalingo, il faut passer par le repo git.

```bash
# import du fichier sur la machine et connexion
scalingo -app APP_NAME run --file <nom_de_ton_fichier> bash
# copie du fichier importé sur le dossier courant
cp /tmp/uploads/<nom_de_ton_fichier> .
```

### Execution d'un cron manuellement

```bash
scalingo -app APP_NAME run bash
> node dist/cron_jobs/launch.js <nom_du_job>
```

### Insertion des universités

Voir aussi le script "scaling-dev-seed.sh" lié à "scalingo.json" qui permet d'insérer ces données sur les reviews app lors de leur 1er deploiement.

```bash
node scripts/insertUniversities.js # Insert into universities tables
node scripts/insertEmailToUniversities.js test/seed/test-ssu-renew.csv # insert emails contacts from CSV files (need to ask support for rights)
ts-node scripts/insertAddressToUniversities.ts
```

### Ajout de la correspondance entre université et psychologues

Pour appliquer sur l'ensemble des psychologues acceptés en base, le script `scripts/matchPsyToUniversities.ts` assigne les universités en fonction du département (voir fichier `utils/departementToUniversityName.ts`)

Pour gérer les cas particuliers, le script `scripts/matchSpecialPsyToUniversities.ts` applique les assignations du fichier `scripts/psyToUni.js`.

L'option `--dry-run` permet de visualiser les changements sans qu'ils soient appliqués.

```bash
ts-node scripts/matchPsyToUniversities.ts [--dry-run]
ts-node scripts/matchSpecialPsyToUniversities.ts [--dry-run]
```

### Anonymisation des données sensibles

Ce script est utilisé sur l'environnement de staging afin de remplacer les données sensibles et visibles par de fausses informations après la récupération de données réelles (cf #les-donnees).

Il ne peut pas être exécuté en production.

```bash
ts-node scripts/anonymizeDb.ts
```

### Clean des noms d'institutions

Cette tache s'effectue en 3 étapes.

#### Géneration du fichier de référence des institutions (en local)

Apres avoir mis à jour le fichier `script/completeInstitutions.json` téléchargé en json depuis
[le site officiel](https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-principaux-etablissements-enseignement-superieur/export/?disjunctive.type_d_etablissement&disjunctive.typologie_d_universites_et_assimiles), on récupere les noms des institutions avec :

```bash
ts-node scripts/createInstitutionNames.ts
```

#### Récuperération des institutions rentrées par les psy (en local)

Il faut récuperer la liste des noms d'institutions qu'on veut mettre à jour depuis métabase dans le fichier `script/patientsInstitution.json` et lancer:

```bash
ts-node scripts/getCleanInstitutionsName.ts
```

Ceci crée un fichier `script/newPatientsInstitution.json`. Ce dernier est un dictionnaire qui montre comment va être transformé chaque nom d'institution. Le nouveau nom est stocké dans `target`, il y a le `rating` determiné par le paquet `string-similarity` et enfin un boolean `go` pour determiner si on peut changer le nom ou pas. Par defaut si le rating est supérieur à 0.7, il vaut true. Mais une analyse manuelle est nécessaire pour s'assurer de la cohérence des noms (ne pas hésiter à changer go en true ou false ou même la target directement).

#### Update en base (sur le serveur de prod)

Une fois le fichier `script/newPatientsInstitution.json` créé, on le push sur le serveur (voir la section correspondante) on peut faire l'update en base.
L'option `--dry-run` permet de visualiser les changements sans qu'ils soient appliqués.

```bash
ts-node scripts/cleanPatientsInstitution.ts [--dry-run]
```

## Les données

Pour afficher une liste de psychologues, nous importons les données venant de l'API démarches simplifiées (DS) dans la base de données Postgresql à l'aide d'un cron. Cela nous permet un meilleur taux de réponses et une maitrise en cas de pic de traffic.

L'API DS est appellée à intervalle regulier à l'aide d'un CRON pour mettre à jour la table PG `psychologists` et on stockera le dernier `cursor` qui correspond à la dernière page requête de l'API dans la table PG `ds_api_cursor` pour ne rappeller que les pages necessaires et limiter le nombre d'appel à l'API DS.

Cependant, certaines données dans DS vont être modifiées au fil du temps, et il nous est donc obligatoire de mettre à jour toutes les données, dans ce cas là nous n'utilisons pas le `cursor` de l'API à l'aide d'un 2ème CRON moins fréquent.

API de démarches simplifiées :

* Documentation : <https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/graphql>
* Schema: <https://demarches-simplifiees-graphql.netlify.app/query.doc.html>

Pour mettre à jour toutes les données venant de DS vers PG, un cron est lancé à intervalle régulier (voir la page containers de Scalingo) :

```bash
node ./cron_jobs/cron.js
```
