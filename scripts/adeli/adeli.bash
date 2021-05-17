#!/bin/bash

adeli=$1

URL='https://service.annuaire.sante.fr/annuaire-sante-webservices/V300/services/extraction/PS_LibreAcces'
FILENAME_PREFIX='PS_LibreAcces_Personne_activite'
ARCHIVE_NAME='archive.zip'

# It can ONLY be set to true IN DEV!
KEEP_ARCHIVE=true

download_archive () {
  # TODO: use ssl certificate
  curl $URL --compressed --insecure --output $ARCHIVE_NAME
}

clean_archive () {
  rm $ARCHIVE_NAME
}

get_filename_to_unzip () {
  unzip -Z1 $ARCHIVE_NAME | grep $FILENAME_PREFIX
}

get_entry_from_adeli () {
  unzip -p $ARCHIVE_NAME $fileToUnzip | grep "|$adeli|" 
}

print_info_from_entry () {
  if [ -z $entry ]
  then 
    printf '{"exists":false}\n'
  else
    IFS='|' # pipe (|) is set as delimiter
    read -a arr <<< "$entry"  # entry is read into an array as tokens separated by IFS=
    printf '{"exists": true, "lastname": "%s", "firstname": "%s", "department": "%s", "profession": "%s"}\n' "${arr[7]}" "${arr[8]}" "${arr[9]}" "${arr[10]}"
    IFS=' ' # reset to default value after usage
  fi
}

if [ ! -f "$ARCHIVE_NAME" ]; then
  download_archive
fi

fileToUnzip="$(get_filename_to_unzip)"

entry="$(get_entry_from_adeli fileToUnzip)"

print_info_from_entry

if [ ! $KEEP_ARCHIVE ]; then
  clean_archive
fi
