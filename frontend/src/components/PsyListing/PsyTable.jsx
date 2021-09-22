import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Button } from '@dataesr/react-dsfr';

const PsyTable = ({
  page,
  setPage,
  psychologists,
  nameFilter,
  addressFilter,
  teleconsultation,
  noResult,
}) => {
  const [surrendingPages, setSurrendingPages] = useState(0);
  const history = useHistory();
  const table = useRef(null);

  const columns = [
    {
      name: 'name',
      label: 'Nom',
      render: psychologist => `${psychologist.lastName.toUpperCase()} ${psychologist.firstNames}`,
    },
    {
      name: 'address',
      label: 'Adresse',
      render: psychologist => (psychologist.otherAddress
        ? (
          <>
            <div>{psychologist.address}</div>
            <div>{psychologist.otherAddress}</div>
          </>
        )
        : psychologist.address),
    },
    {
      name: 'action',
      label: '',
      render: psychologist => (
        <>
          <div className="fr-displayed-xs fr-hidden-sm">
            <Button
              secondary
              size="sm"
              onClick={() => goToProfile(psychologist)}
              className="fr-fi-arrow-right-line"
            />
          </div>
          <div className="fr-hidden-xs fr-displayed-sm">
            <Button
              data-test-id="psy-table-row-profil-button"
              secondary
              size="sm"
              onClick={() => goToProfile(psychologist)}
              icon="fr-fi-arrow-right-line"
              iconPosition="right"
            >
              Voir le profil
            </Button>
          </div>
        </>
      ),
    },
  ];

  const goToProfile = psychologist => {
    const searchPath = `?page=${page}&name=${nameFilter}&address=${addressFilter}&teleconsultation=${teleconsultation}`;
    if (history.location.search !== searchPath) {
      history.push(`/trouver-un-psychologue${searchPath}`);
    }
    history.push(`/trouver-un-psychologue/${psychologist.dossierNumber}`);
  };

  const updateSurrendingPages = () => {
    if (table.current) {
      const { width } = table.current.getBoundingClientRect();
      if (width > 700) {
        setSurrendingPages(3);
      } else if (width > 550) {
        setSurrendingPages(2);
      } else if (width > 500) {
        setSurrendingPages(1);
      } else {
        setSurrendingPages(0);
      }
    }
  };

  useEffect(() => {
    updateSurrendingPages();
  }, [table]);

  useEffect(() => {
    window.addEventListener('resize', updateSurrendingPages);
    return () => window.removeEventListener('resize', updateSurrendingPages);
  }, []);

  let title = 'Tous les résultats';
  if (nameFilter || addressFilter || teleconsultation) {
    if (psychologists.length === 1) {
      title = '1 résultat';
    } else {
      title = `${psychologists.length} résultats`;
    }
  }

  const currentPage = Math.min(page, Math.ceil(psychologists.length / 10));
  return (
    <div ref={table}>
      {psychologists.length > 0 ? (
        <>
          <Table
            data-test-id="psy-table"
            className="fr-mb-3w"
            caption={title}
            rowKey="dossierNumber"
            columns={columns}
            data={psychologists}
            pagination
            paginationPosition="center"
            page={currentPage}
            perPage={10}
            setPage={p => {
              setPage(p);
              table.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }}
            surrendingPages={surrendingPages}
          />
        </>
      ) : noResult }
    </div>
  );
};

export default PsyTable;
