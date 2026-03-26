import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link, Pagination, Icon, Badge } from '@dataesr/react-dsfr';
import styles from './psyTable.cssmodule.scss';

const PsyTable = ({
  page,
  setPage,
  psychologists,
  nameFilter,
  addressFilter,
  languageFilter,
  teleconsultation,
}) => {
  const [surrendingPages, setSurrendingPages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const table = useRef(null);

  const goToProfile = psychologist => {
    const searchPath = `?page=${page}&name=${nameFilter}&address=${addressFilter}&teleconsultation=${teleconsultation}&language=${languageFilter}`;
    if (location.search !== searchPath) {
      navigate(`/trouver-un-psychologue${searchPath}`);
    }

    if (__MATOMO__) {
      _paq.push(['trackEvent', 'PsychologistProfile', 'ViewFromResults', psychologist.dossierNumber]);
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

  const pagedPsychologists = useMemo(() => {
    const start = (page - 1) * 10;
    return psychologists.slice(start, start + 10);
  }, [psychologists, page]);

  const pageCount = Math.ceil(psychologists.length / 10);
  const currentPage = Math.min(page, pageCount);
  return (
    <div ref={table}>
      {psychologists.length > 0 && (
        <div className={styles.table} data-test-id="psy-table">
          {pagedPsychologists.map(psychologist => (
            <div className={styles.box} key={psychologist.dossierNumber} data-test-id="psy-row">
              <div className={styles.personnalInfo}>
                <Icon className={styles.userIcon} name="ri-user-line" size="2x" />
                <div>
                  <h6>
                    {psychologist.lastName.toUpperCase()}
                    {' '}
                    {psychologist.firstNames}
                  </h6>
                  <div className={styles.addressInfo}>
                    <div>
                      <Icon className="fr-mr-1w" name="ri-map-pin-2-fill" size="lg" />
                      <span>
                        {
                          psychologist.city
                            ? `${psychologist.city} • ${psychologist.postcode}`
                            : psychologist.address
                        }
                      </span>
                      {psychologist.otherCity && psychologist.otherCity !== psychologist.city && (
                        <>
                          <span className={styles.separator} />
                          <span>{`${psychologist.otherCity} • ${psychologist.otherPostcode}`}</span>
                        </>
                      )}
                    </div>
                    {psychologist.teleconsultation && (
                      <>
                        <div className={styles.optionalSeparator} />
                        <Badge
                          className={styles.badge}
                          icon="ri-webcam-fill"
                          text="Téléconsultation disponible"
                          colorFamily="green-bourgeon"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.horizontalSeparator} />
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
                <Link
                  data-test-id="psy-table-row-profil-button"
                  href={`/trouver-un-psychologue/${psychologist.dossierNumber}`}
                  onClick={() => goToProfile(psychologist)}
                  className="fr-btn fr-btn--secondary"
                >
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          ))}
          <Pagination
            currentPage={currentPage}
            surrendingPages={surrendingPages}
            pageCount={pageCount}
            onClick={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default PsyTable;
