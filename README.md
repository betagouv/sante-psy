# Chèques d'Accompagnement Psychologique
Vous pouvez voir ce site en ligne là : < ? >


## Lancer en prod

```
npm start
```

Ce repo contient tout ce qu'il faut pour tourner sur Scalingo. Il suffit de déployer la branche main sur votre instance Scalingo.


## Lancer ce site localement
Vous devez avoir npm installé sur votre machine.

```
git clone https://github.com/betagouv/cheque-psy
cd cheque-psy
cp .env.sample .env # replace API_TOKEN
npm install
npm run dev
# http://localhost:8080 is ready
```

### Test
```
npm test
```

https://github.com/jhnns/rewire

### Lint 
```
npm run lint
```

### Données
API de demarches simplifiées :
* https://doc.demarches-simplifiees.fr/pour-aller-plus-loin/graphql
* https://demarches-simplifiees-graphql.netlify.app/query.doc.html
### Libraries
* https://github.com/prisma-labs/graphql-request
* <table> http://tabulator.info/