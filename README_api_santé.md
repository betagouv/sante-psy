# API Santé 

For now at : 
https://api-sante.herokuapp.com/

Built with datasette : https://github.com/simonw/datasette

## How to query the API
Go to https://api-sante.herokuapp.com/ for a GUI to navigate in the data.

Query for a numéro Adeli : use field "Identification nationale PP", with value : `0 + adeli` (ex : if adeli = 12345, query `012345`)
The column "Identification nationale PP" has an index on it, which makes the queries much faster (300ms). Other queries are slow (10s)
Example query :
https://api-sante.herokuapp.com/annuaire/annuaire.json?Identification+nationale+PP__exact=0750006033
The psys returned are in `rows` array (emtpy if no psys found)

See [datasette doc on API](https://docs.datasette.io/en/stable/pages.html)


## How the API is built
### Download data file and unzip it : 

```
curl "https://annuaire.sante.fr/web/site-pro/extractions-publiques?p_p_id=abonnementportlet_WAR_Inscriptionportlet_INSTANCE_gGMT6fhOPMYV&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&_abonnementportlet_WAR_Inscriptionportlet_INSTANCE_gGMT6fhOPMYV_nomFichier=PS_LibreAcces_202105311652.zip" -o temp.zip
unzip temp.zip
mv PS_LibreAcces_Personne_activite_* annuaire.csv
rm PS_LibreAcces_*
rm temp.zip
```

### Create sqlite file for server to read from : 
```
pip install csvs-to-sqlite
csvs-to-sqlite annuaire.csv annuaire.db --separator '|' --index "Identification nationale PP"
```
We index on "Identification nationale PP" : this is what we will search most (numéro Adeli)

### Upload to heroku : 
Requires a heroku account, and having signed-in the heroku CLI
```
pip install datasette
datasette publish heroku annuaire.db -n 'api-sante'
```

### Refresh the data : todo
rerun the whole thing.
Make a cron job on the heroku machine ? 
