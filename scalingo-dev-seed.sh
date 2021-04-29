#!/bin/bash

if [ "$SEED_FAKE_DATA_DATABASE" = "true" ] ; then
  echo "Seeding database";
  npm run migrate;
  npm run seed;
  node scripts/insertUniversities.js; # Insert into universities tables
  node scripts/insertEmailToUniversities.js TO-DO.csv; # insert emails contacts from CSV files (need to ask support for rights)
else
  echo "Not seeding database";
fi
