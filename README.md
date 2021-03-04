# Santé Psy | https://santepsyetudiants.beta.gouv.fr/
CI branche `main` :  ![image](https://github.com/betagouv/sante-psy/workflows/Node.js%20CI/badge.svg)
## Lancer en prod
Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.

Le deploiement sur scalingo se base sur le fichier [`Procfile`](https://doc.scalingo.com/platform/app/procfile)
```
npm start
```

## Lancer ce site localement
Vous devez avoir npm et docker compose installés sur votre machine.

```
git clone https://github.com/betagouv/sante-psy
cd sante-psy
cp .env.sample .env # replace API_TOKEN from Demarches Simplifiees API
docker-compose up
# http://localhost:8080 is ready
```

Pour controler visuellement la base de données, nous conseillons :
* https://dbeaver.io/download/

### Pour tester les évolutions de base de données

#### Créer un fichier de migration
```
npm run makeMigration migration-name
```

#### Executer les migrations
```
# Supprimer les tables existantes
docker-compose down # ou docker-compose rm -f # removes already existing containers https://docs.docker.com/compose/reference/rm/

# Les recréer
docker-compose up
> (...) 
web_1  | Creating ds_api_cursor table
web_1  | Creating universities table
web_1  | Creating patients table
web_1  | Creating psychologists table
web_1  | Creating appointments table
Santé Psy Étudiants listening at http://localhost:8080   
```

### Les données
Pour afficher une liste de psychologues, nous importons les données venant de l'API demarches simplifiées (DS) dans la base de données Postgresql à l'aide d'un cron. Cela nous permet un meilleur taux de réponses et une maitrise en cas de pic de traffic.


L'API DS est appellée à interval regulier à l'aide d'un CRON pour mettre à jour la table PG `psychologists` et on stockera le dernier `cursor` qui correspond à la dernière page requête de l'API dans la table PG `ds_api_cursor` pour ne rappeller que les pages necessaires et limiter le nombre d'appel à l'API DS, ceci est fait à l'aide d'un cron.

Cependant, certaines données dans DS vont être modifiées au fil du temps, et il nous est donc obligatoire de mettre à jour toutes les données, dans ce cas là nous n'utilisons pas le `cursor` de l'API à l'aide d'un 2ème CRON moins fréquent.

API de demarches simplifiées :
* Documentation : https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/graphql
* Schema: https://demarches-simplifiees-graphql.netlify.app/query.doc.html

Pour mettre à jour toutes les données venant de DS vers PG, un cron est lancé à interval régulier (voir la page containers de Scalingo) :
```
node ./cron_jobs/cron.js
```

#### Accès à postgres
Avec [le scalingo CLI](https://doc.scalingo.com/cli) et le nom de l'app sur scalingo
```
scalingo -a APP_NAME pgsql-console
```
On peut insérer des données comme ceci :
```
INSERT INTO public.psychologists
("dossierNumber", adeli, "firstNames", "lastName", email, address, departement, region, phone, website, teleconsultation, description, languages, training, diploma, university, "payingUniversityId", "createdAt", "updatedAt", archived, state, "personalEmail")
VALUES('77356ab0-349b-4980-899f-bad2ce87e2f1', 'adeli', 'firstname', 'lastname', 'publicemail@beta.gouv.fr', '', '', '', '', '', false, 'accfzfz', '', '[]', '', '', null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'accepte', 'private.email@beta.gouv.fr');
```

### Test
Pour utiliser le container Postgresql 
```
# Start DB and build SQL tables
docker-compose -f docker-compose-only-db.yml up

# start tests
npm test
```

#### Tester uniquement un test
```
npm test -- --grep "should call batchInsert on PG"
```


#### Test du cron
```bash
docker-compose up -d
docker ps # get container name
docker exec -ti sante-psy_web_1 bash -c "node ./cron_jobs/cron.js"
> 🚀 The job "Import data from DS API to PG" is ON * * * * *
Started 1 cron jobs
(...)
```


#### Test sur la CI
Sur la CI de github (.github/workflows/nodejs.yml) on utilise docker-compose avec l'option `--abort-on-container-exit` pour lancer les tests dans le container de l'application et finir le container de PG une fois que les tests ont été exécutés.
> Stops all containers if any container was stopped. Incompatible with --detach.

#### Code coverage
```
npm run coverage
```

Ensuite, visiter avec votre navigateur pour visualiser le dossier `./coverage` :
*  $REPO_PATH/sante-psy/coverage/index.html

### Les emails - serveur SMTP Maildev
[Maildev](http://maildev.github.io/maildev/) est un serveur SMTP avec une interface web conçus pour le développement et les tests.

Sans docker: Une fois installé et lancé, il suffit de mettre la variable d'environnement MAIL_SERVICE à maildev pour l'utiliser. MAIL_USER et MAIL_PASS ne sont pas nécessaires.

Avec docker: ne pas préciser de MAIL_SERVICE, les bonnes variables d'environnement sont déjà précisées dans le docker-compose

Tous les emails envoyés par le code seront visibles depuis l'interface web de Maildev :
* http://localhost:1080/

### Lint 
```
npm run lint
```

## Pre-commit pre-push
* Un commit va lancer le linter

En savoir plus : https: //github.com/typicode/husky/tree/master#install

Si vous rencontez des problèmes avec les git hooks
* S'assurer que le dossier des hooks soit `.git/hooks` : `git rev-parse --git-path hooks`
* Sinon utilisez cette commande `git config core.hooksPath .git/hooks/`


### Variables d'environnement
Voir `.env.sample` pour la liste complète

### Libraries
* https://github.com/prisma-labs/graphql-request
* <table> http://tabulator.info/
Tester les fonctions privées :
* https://github.com/jhnns/rewire
* CSRF tokens : https://github.com/pillarjs/understanding-csrf#csrf-tokens