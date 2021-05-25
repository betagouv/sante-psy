import React from 'react';

import { ReactTabulator } from 'react-tabulator';

import 'react-tabulator/lib/styles.css';
import 'react-tabulator/css/tabulator_modern.css';

const addPrefixToUrl = urlCell => {
  const url = urlCell.getValue();
  if (!url.startsWith('http')) {
    return `//${url}`;
  }
  return url;
};

const columns = [
  {
    title: 'Nom',
    field: 'lastName',
    sorter: 'string',
    responsive: 0,
  },
  {
    title: 'Prénom(s)',
    field: 'firstNames',
    sorter: 'string',
    responsive: 0,
  },
  {
    title: 'Département',
    field: 'departement',
    sorter: 'string',
    maxWidth: 300,
    responsive: 0,
  },
  {
    title: 'Adresse',
    field: 'address',
    sorter: 'string',
    maxWidth: 300,
    responsive: 0,
    formatter: 'link',
    formatterParams: { labelField: 'address', urlPrefix: 'https://www.openstreetmap.org/search?query=', target: '_blank' },
  },
  {
    title: '📞',
    field: 'phone',
    sorter: 'string',
    responsive: 0,
    formatter: 'link',
    formatterParams: { labelField: 'phone', urlPrefix: 'tel:' },
  },
  {
    title: 'Email',
    field: 'email',
    sorter: 'string',
    responsive: 0,
    formatter: 'link',
    formatterParams: { labelField: 'email', urlPrefix: 'mailto:' },
  },
  {
    title: 'Téléconsultation',
    field: 'teleconsultation',
    headerTooltip: 'Téléconsultation',
    responsive: 0,
    sorter: 'string',
    hozAlign: 'center',
    tooltip: 'Est ce que le psychologue accepte la téléconsultation ?',
    formatter: 'tickCross',
  },
  {
    title: 'Langues parlées',
    field: 'languages',
    responsive: 0,
    sorter: 'string',
    hozAlign: 'center',
    formatter: 'textarea',
  },
  {
    title: 'Site web',
    field: 'website',
    sorter: 'string',
    maxWidth: 200,
    responsive: 0,
    formatter: 'link',
    formatterParams: { labelField: 'website', target: '_blank', url: addPrefixToUrl },
  },
];

const options = {
  locale: 'fr-fr',
  langs: { // http://tabulator.info/docs/4.2/localize#setup
    'fr-fr': { // French language definition
      pagination: {
        first: 'Première',
        first_title: 'Première Page',
        last: 'Dernière',
        last_title: 'Dernière Page',
        prev: 'Précédent',
        prev_title: 'Page Précédente',
        next: 'Suivant',
        next_title: 'Page Suivante',
      },
      headerFilters: { default: 'Rechercher par adresse' },
    },
  },
  tooltipsHeader: true,
  layout: 'fitData', // fit columns to width of table
  responsiveLayout: 'hide', // hide columns that dont fit on the table //@TODO
  tooltips: true, // show tool tips on cells
  addRowPos: 'top', // when adding a new row, add it to the top of the table
  history: true, // allow undo and redo actions on the table
  pagination: 'local', // paginate the data
  paginationSize: 20, // allow XX rows per page of data
  movableColumns: false, // allow column order to be changed
  resizableRows: false, // allow row order to be changed
  resizableColumns: false,
  headerFilterPlaceholder: 'Rechercher un psychologue',
};

const PsyTable = ({ psychologists }) => (
  <ReactTabulator
    columns={columns}
    data={psychologists}
    options={options}
  />
);

export default PsyTable;
