# Santé Psy | https://santepsyetudiants.beta.gouv.fr/

## Lancer en prod
Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.

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

```
docker-compose rm -f # removes already existing containers https://docs.docker.com/compose/reference/rm/
docker-compose up
> (...) 
Santé Psy Étudiants listening at http://localhost:8080   
```
### Lancer les CRONs localement
Pour améliorer afficher une liste de psychologues, nous importons les données venant de l'API demarches simplifiées (DS) dans la base de données Postgresql à l'aide d'un cron. Cela nous permet un meilleur taux de réponses et une maitrise en cas de pic de traffic.

#### Les données
L'API DS est appellée à interval regulier à l'aide d'un CRON pour mettre à jour la table PG `psychologist` et on stockera le dernier `cursor` qui correspond à la dernière page requête de l'API dans la table PG `ds_api_cursor` pour éviter de rappeller seulement les pages necessaires et limiter le nombre d'appel à l'API DS.

Cependant, certaines données dans DS vont être modifiées au fil du temps, et il nous est donc obligatoire de mettre à jour toutes les données, dans ce cas là nous n'utilisons pas le `cursor` de l'API.

API de demarches simplifiées :
* Documentation : https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/graphql
* Schema: https://demarches-simplifiees-graphql.netlify.app/query.doc.html

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
docker exec -ti sante-psy_web_1 bash -c "node cron_jobs/cron.js"
> 🚀 The job "Import data from DS API to PG" is ON * * * * *
Started 1 cron jobs
(...)
```

Tester les fonctions privées :
* https://github.com/jhnns/rewire

### Lint 
```
npm run lint
```

## Pre-commit pre-push
* Un commit va lancer le linter
* Un push lancera les tests

En savoir plus : https: //github.com/typicode/husky/tree/master#install

Si vous rencontez des problèmes avec les git hooks
* S'assurer que le dossier des hooks soit `.git/hooks` : `git rev-parse --git-path hooks`
* Sinon utilisez cette commande `git config core.hooksPath .git/hooks/`


### Variables d'environnement
Voir `.env.sample` pour la liste complète

### Libraries
* https://github.com/prisma-labs/graphql-request
* <table> http://tabulator.info/
