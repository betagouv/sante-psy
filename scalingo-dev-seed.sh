#!/bin/bash

if [ "$SEED_FAKE_DATA_DATABASE" = "true" ] ; then
  echo "Seeding database";
  pnpm run migrate;
  pnpm run seed;
else
  echo "Not seeding database";
fi
