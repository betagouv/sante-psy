# Santé Psy | https://santepsyetudiants.beta.gouv.fr/

## Lancer en prod
Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.

```
npm start
```

## Lancer ce site localement
Vous devez avoir npm installé sur votre machine.

```
git clone https://github.com/betagouv/sante-psy
cd sante-psy
cp .env.sample .env # replace API_TOKEN from Demarches Simplifiees API
npm install
npm run dev
# http://localhost:8080 is ready
```

### Test
```
npm test
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

### Données
API de demarches simplifiées :
* https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/graphql
* https://demarches-simplifiees-graphql.netlify.app/query.doc.html
### Libraries
* https://github.com/prisma-labs/graphql-request
* <table> http://tabulator.info/
