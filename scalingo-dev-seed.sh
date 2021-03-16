#!/bin/bash

if [ "$SEED_FAKE_DATA_DATABASE" = "true" ] ; then
  echo "Seeding database";
  npm run migrate;
  npm run seed;
else
  echo "Not seeding database";
fi
