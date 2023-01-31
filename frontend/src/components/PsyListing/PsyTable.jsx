import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Button, Pagination, Icon, Badge } from '@dataesr/react-dsfr';
import styles from './psyTable.cssmodule.scss';

const PsyTable = ({
  page,
  setPage,
  psychologists,
  nameFilter,
  addressFilter,
  languageFilter,
  teleconsultation,
  noResult,
  geoLoading,
}) => {
  const [surrendingPages, setSurrendingPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
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
          <div className="fr-unhidden fr-hidden-sm">
            <Button
              secondary
              size="sm"
              onClick={() => goToProfile(psychologist)}
              className="fr-fi-arrow-right-line"
            />
          </div>
          <div className="fr-hidden fr-unhidden-sm">
            <Button
              data-test-id="psy-table-row-profil-button"
              secondary
              size="sm"
              onClick={() => goToProfile(psychologist)}
              icon="fr-fi-arrow-right-line"
              iconPosition="right"
            >
              Voir les infos
            </Button>
          </div>
        </>
      ),
    },
  ];

  const goToProfile = psychologist => {
    const searchPath = `?page=${page}&name=${nameFilter}&address=${addressFilter}&teleconsultation=${teleconsultation}&language=${languageFilter}`;
    if (location.search !== searchPath) {
      navigate(`/trouver-un-psychologue${searchPath}`);
    }
    navigate(`/trouver-un-psychologue/${psychologist.dossierNumber}`);
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
  if (geoLoading) {
    title = 'Chargement des psychologues autour de vous...';
  } else
  if (nameFilter || addressFilter || teleconsultation || languageFilter) {
    if (psychologists.length === 1) {
      title = '1 résultat';
    } else {
      title = `${psychologists.length} résultats`;
    }
  }

  const pageCount = Math.ceil(psychologists.length / 10);
  const currentPage = Math.min(page, Math.ceil(psychologists.length / 10));
  return (
    <div ref={table}>
      {psychologists.length > 0 ? (
        <div className={styles.table}>
          { psychologists.map(psychologist => (
            <div className={styles.box} key={psychologist.dossierNumber}>
              <div className={styles.personnalInfo}>
                <Icon className={styles.userIcon} name="ri-user-line" size="2x" />
                <div>
                  <h6>
                    {psychologist.lastName.toUpperCase()}
                    {' '}
                    {psychologist.firstNames}
                  </h6>
                  <div className={styles.personnalInfo}>
                    <div>
                      <Icon name="ri-map-pin-2-fill" size="lg" />
                      <span>{psychologist.address}</span>
                      {psychologist.otherAddress && <span>{psychologist.otherAddress}</span>}
                    </div>
                    {psychologist.teleconsultation && (
                    <>
                      <div className={styles.separator} />
                      <Badge
                        icon="ri-webcam-fill"
                        text="Téléconsultation disponible"
                        colorFamily="green-bourgeon"
                      />
                    </>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.contactInfo}>
                <div
                  onClick={() => { window.location.href = `mailto:${psychologist.email}`; }}
                >
                  <Icon name="ri-mail-fill" size="2x" />
                </div>
                <div className={styles.bigSeparator} />
                <div
                  onClick={() => { window.location.href = `tel:${psychologist.phone}`; }}
                >
                  <Icon name="ri-phone-fill" size="2x" />
                </div>
                <Button
                  secondary
                  onClick={() => goToProfile(psychologist)}
                >
                  Plus d&lsquo;info
                </Button>
              </div>
            </div>
          ))}
          <Pagination
            currentPage={currentPage}
            surrendingPages={surrendingPages}
            pageCount={pageCount}
          />
        </div>
      ) : noResult }
    </div>
  );
};

export default PsyTable;
