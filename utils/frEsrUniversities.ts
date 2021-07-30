// eslint-disable-next-line max-len
// Source: https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-principaux-etablissements-enseignement-superieur/

const frEsrUniversities = [
  {
    name: 'Aix-Marseille',
    siret: '13001533200013',
    address1: '',
    address2: '58 boulevard Charles Livon',
    address3: '',
    address4: '',
    postal_code: '13284',
    city: 'Marseille CEDEX 07',
  },
  {
    name: 'Angers',
    siret: '19490970100303',
    address1: '',
    address2: '40 RUE DE RENNES',
    address3: '',
    address4: 'BP 73532',
    postal_code: '49035',
    city: 'ANGERS CEDEX 1',
  },
  {
    name: 'Antilles – Pôle Guadeloupe',
    siret: '19971585500011',
    address1: '',
    address2: '',
    address3: 'Campus universitaire de Fouillole',
    address4: 'BP 250',
    postal_code: '97157',
    city: 'Pointe-à-Pitre CEDEX',
  },
  {
    name: 'Avignon',
    siret: '19840685200204',
    address1: '',
    address2: '74 rue Louis Pasteur',
    address3: '',
    address4: '',
    postal_code: '84029',
    city: 'Avignon CEDEX 1',
  },
  {
    name: 'Bretagne Occidentale',
    siret: '19290346600014',
    address1: '',
    address2: '3 rue des Archives',
    address3: '',
    address4: 'CS 93837',
    postal_code: '29238',
    city: 'Brest CEDEX 3',
  },
  {
    name: 'Bretagne Sud',
    siret: '19561718800600',
    address1: '',
    address2: '27 rue Armand Guillemot',
    address3: '',
    address4: 'BP 92116',
    postal_code: '56321',
    city: 'Lorient CEDEX',
  },
  {
    name: 'Caen Normandie',
    siret: '19141408500016',
    address1: '',
    address2: 'Esplanade de la Paix',
    address3: '',
    address4: 'CS 14032',
    postal_code: '14032',
    city: 'Caen CEDEX 5',
  },
  {
    name: 'Cergy Paris Université',
    siret: '13002597600015',
    address1: '',
    address2: '33 boulevard du Port',
    address3: '',
    address4: '',
    postal_code: '95011',
    city: 'Cergy-Pontoise CEDEX',
  },
  {
    name: 'Clermont-Auvergne (UCA)',
    siret: '13002806100013',
    address1: '',
    address2: '49 boulevard François Mitterrand',
    address3: '',
    address4: 'CS 60032',
    postal_code: '63001',
    city: 'Clermont-Ferrand CEDEX 1',
  },
  {
    name: 'Corsica Pasquale Paoli',
    siret: '19202664900017',
    address1: 'Campus Grimaldi, Bâtiment Jean-Toussaint Desanti',
    address2: 'Rue du Faubourg Saint-Antoine',
    address3: '',
    address4: '',
    postal_code: '20250',
    city: 'Corte',
  },
  {
    name: 'Côte d’Azur',
    siret: '13002566100013',
    address1: '',
    address2: '28 avenue Valrose',
    address3: '',
    address4: 'BP 2135',
    postal_code: '6103',
    city: 'Nice CEDEX 2',
  },
  {
    name: 'Dijon',
    siret: '19211237300019',
    address1: "Maison de l'université",
    address2: 'Esplanade Erasme',
    address3: '',
    address4: 'BP 27877',
    postal_code: '21078',
    city: 'Dijon CEDEX',
  },
  {
    name: 'Evry',
    siret: '19911975100014',
    address1: '',
    address2: 'Boulevard François Mitterrand',
    address3: '',
    address4: '',
    postal_code: '91000',
    city: 'Évry-Courcouronnes',
  },
  {
    name: 'Franche-Comté',
    siret: '19251215000363',
    address1: '',
    address2: '1 RUE GOUDIMEL',
    address3: '',
    address4: '',
    postal_code: '25030',
    city: 'BESANCON CEDEX',
  },
  {
    name: 'Grenoble Alpes',
    siret: '13002608100013',
    address1: '',
    address2: '621 avenue Centrale',
    address3: '',
    address4: '',
    postal_code: '38400',
    city: "Saint-Martin-d'Hères",
  },
  {
    name: 'Haute-Alsace (UHA)',
    siret: '19681166500013',
    address1: '',
    address2: '2 rue des Frères Lumière',
    address3: '',
    address4: '',
    postal_code: '68093',
    city: 'Mulhouse CEDEX',
  },
  {
    name: 'La Réunion',
    siret: '19974478000016',
    address1: '',
    address2: '15 avenue René Cassin',
    address3: '',
    address4: 'CS 92003',
    postal_code: '97744',
    city: 'Saint-Denis Cedex9',
  },
  {
    name: 'La Rochelle',
    siret: '19170032700015',
    address1: 'Technoforum',
    address2: '23 avenue Albert Einstein',
    address3: '',
    address4: 'BP 33060',
    postal_code: '17031',
    city: 'La Rochelle',
  },
  {
    name: 'La Sorbonne',
    siret: '13002338500011',
    address1: '',
    address2: '21 rue de l’École de médecine',
    address3: '',
    address4: '',
    postal_code: '75006',
    city: 'PARIS',
  },
  {
    name: 'Le Havre Normandie',
    siret: '19762762300097',
    address1: '',
    address2: '25 rue Philippe Lebon',
    address3: '',
    address4: 'BP 1123',
    postal_code: '76063',
    city: 'Le Havre CEDEX',
  },
  {
    name: 'Le Mans Université',
    siret: '19720916600010',
    address1: '',
    address2: 'Avenue Olivier Messiaen',
    address3: '',
    address4: '',
    postal_code: '72085',
    city: 'Le Mans CEDEX 9',
  },
  {
    name: 'Lille',
    siret: '13002358300011',
    address1: '',
    address2: '42 rue Paul Duez',
    address3: '',
    address4: '',
    postal_code: '59000',
    city: 'Lille',
  },
  {
    name: 'Limoges',
    siret: '19870669900321',
    address1: '',
    address2: '33 RUE FRANCOIS MITTERAND',
    address3: '',
    address4: 'BP 23204',
    postal_code: '87032',
    city: 'LIMOGES CEDEX 01',
  },
  {
    name: 'Lorraine Sud-Nancy',
    siret: '13001550600012',
    address1: '',
    address2: '34 COURS LEOPOLD',
    address3: '',
    address4: '',
    postal_code: '54052',
    city: 'NANCY CEDEX',
  },
  {
    name: 'Lyon 1',
    siret: '19691774400019',
    address1: '',
    address2: '43 boulevard du 11 Novembre 1918',
    address3: '',
    address4: '',
    postal_code: '69622',
    city: 'VilleurbanneCEDEX',
  },
  {
    name: 'Lyon 2',
    siret: '19691775100014',
    address1: '',
    address2: '86 RUE PASTEUR',
    address3: '',
    address4: '',
    postal_code: '69365',
    city: 'LYON CEDEX 07',
  },
  {
    name: 'Lyon 3',
    siret: '19692437700282',
    address1: '',
    address2: '1C avenue des Frères Lumière',
    address3: '',
    address4: 'CS 78242',
    postal_code: '69372',
    city: 'Lyon CEDEX 08',
  },
  {
    name: 'Montpellier',
    siret: '13002054800017',
    address1: '',
    address2: '163 rue Auguste Broussonnet',
    address3: '',
    address4: '',
    postal_code: '34090',
    city: 'Montpellier',
  },
  {
    name: 'Montpellier 3',
    siret: '19341089100017',
    address1: '',
    address2: 'Route de Mende',
    address3: '',
    address4: '',
    postal_code: '34199',
    city: 'Montpellier CEDEX 5',
  },
  {
    name: 'Nantes',
    siret: '19440984300019',
    address1: '',
    address2: '1 quai de Tourville',
    address3: '',
    address4: 'BP 13522',
    postal_code: '44035',
    city: 'Nantes CEDEX 1',
  },
  {
    name: 'Nîmes',
    siret: '13000375900011',
    address1: 'Site Vauban',
    address2: 'Rue du Docteur Georges Salan',
    address3: '',
    address4: 'CS13019',
    postal_code: '30021',
    city: 'Nîmes CEDEX 1',
  },
  {
    name: 'Orléans',
    siret: '19450855200016',
    address1: 'Château de la Source',
    address2: 'Avenue du Parc Floral',
    address3: '',
    address4: 'BP 6749',
    postal_code: '45067',
    city: 'Orléans CEDEX 2',
  },
  {
    name: 'Paris Descartes (Université de Paris)',
    siret: '13002573700011',
    address1: '',
    address2: '85 boulevard Saint-Germain',
    address3: '',
    address4: '',
    postal_code: '75006',
    city: 'Paris',
  },
  {
    name: 'Paris Est Créteil (UPEC)',
    siret: '19941111700013',
    address1: '',
    address2: '61 avenue du Général de Gaulle',
    address3: '',
    address4: '',
    postal_code: '94010',
    city: 'Créteil CEDEX',
  },
  {
    name: 'Paris Est Marne-la-Vallée (UPEM)',
    siret: '13002612300013',
    address1: '',
    address2: '5 boulevard Descartes',
    address3: '',
    address4: '',
    postal_code: '77420',
    city: 'Champs-sur-Marne',
  },
  {
    name: 'Paris Saclay',
    siret: '13002602400054',
    address1: 'Immeuble Technologique',
    address2: "Route de l'Orme aux Merisiers",
    address3: '',
    address4: '',
    postal_code: '91190',
    city: 'Saint-Aubin',
  },
  {
    name: 'Pau et Pays de l’Adour (UPPA)',
    siret: '19640251500270',
    address1: '',
    address2: 'Avenue de l’Université',
    address3: '',
    address4: 'BP 576',
    postal_code: '64012',
    city: 'Pau CEDEX',
  },
  {
    name: 'Perpignan (UPVD)',
    siret: '19660437500010',
    address1: '',
    address2: '52 avenue Paul Alduy',
    address3: '',
    address4: '',
    postal_code: '66860',
    city: 'Perpignan CEDEX 9',
  },
  {
    name: 'Picardie Jules Verne',
    siret: '19801344300017',
    address1: '',
    address2: 'Chemin du Thil',
    address3: '',
    address4: 'CS 52501',
    postal_code: '80025',
    city: 'AMIENS CEDEX 1',
  },
  {
    name: 'Poitiers',
    siret: '19860856400375',
    address1: '',
    address2: '15 rue de l’Hôtel Dieu',
    address3: '',
    address4: 'TSA 71117',
    postal_code: '86073',
    city: 'Poitiers CEDEX 9',
  },
  {
    name: 'Reims Champagne-Ardenne',
    siret: '19511296600799',
    address1: '',
    address2: '2 avenue Robert Schuman',
    address3: '',
    address4: '',
    postal_code: '51724',
    city: 'Reims CEDEX',
  },
  {
    name: 'Rennes',
    siret: '19350936100013',
    address1: '',
    address2: '2 rue du Thabor',
    address3: '',
    address4: 'CS 46510',
    postal_code: '35065',
    city: 'Rennes CEDEX',
  },
  {
    name: 'Rouen',
    siret: '19761904200017',
    address1: '',
    address2: '1 rue Thomas Becket',
    address3: '',
    address4: '',
    postal_code: '76821',
    city: 'Mont-Saint-Aignan CEDEX',
  },
  {
    name: 'Saint-Etienne – Jean Monnet',
    siret: '19421095100423',
    address1: '',
    address2: '10 rue Tréfilerie',
    address3: '',
    address4: 'CS 82301',
    postal_code: '42023',
    city: 'Saint-Étienne CEDEX 2',
  },
  {
    name: 'Savoie Mont-Blanc',
    siret: '19730858800015',
    address1: '',
    address2: '27 rue Marcoz',
    address3: '',
    address4: '',
    postal_code: '73000',
    city: 'Chambéry',
  },
  {
    name: 'Sorbonne Paris Nord',
    siret: '19931238000017',
    address1: '',
    address2: '99 avenue Jean-Baptiste Clément',
    address3: '',
    address4: '',
    postal_code: '93430',
    city: 'Villetaneuse',
  },
  {
    name: 'Strasbourg (UNISTRA)',
    siret: '13000545700010',
    address1: '',
    address2: '4 rue Blaise Pascal',
    address3: '',
    address4: 'CS 90032',
    postal_code: '67081',
    city: 'Strasbourg CEDEX',
  },
  {
    name: 'Toulon',
    siret: '19830766200017',
    address1: '',
    address2: "Avenue de l'Université",
    address3: '',
    address4: 'CS 60584',
    postal_code: '83041',
    city: 'TOULON CEDEX 9',
  },
  {
    name: 'Tours',
    siret: '19370800500478',
    address1: '',
    address2: "60 rue du Plat d'Étain",
    address3: '',
    address4: 'BP 12050',
    postal_code: '37020',
    city: 'Tours CEDEX 1',
  },
  {
    name: 'Valenciennes',
    siret: '13002574500014',
    address1: '',
    address2: 'Le Mont Houy',
    address3: '',
    address4: '',
    postal_code: '59313',
    city: 'Valenciennes CEDEX 9',
  },
  {
    name: 'Versailles Saint-Quentin (UVSQ)',
    siret: '19781944400013',
    address1: '',
    address2: '55 avenue de Paris',
    address3: '',
    address4: '',
    postal_code: '78035',
    city: 'Versailles CEDEX',
  },
];

export default frEsrUniversities;
