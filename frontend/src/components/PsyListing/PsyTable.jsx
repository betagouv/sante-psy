import React, { useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@codegouvfr/react-dsfr/Badge';
import { Pagination } from '@codegouvfr/react-dsfr/Pagination';
import { useStore } from 'stores/index';
import styles from './psyTable.cssmodule.scss';
import { Button } from '@codegouvfr/react-dsfr/Button';

const PsyTable = ({
  page,
  setPage,
  psychologists,
  nameFilter,
  addressFilter,
  languageFilter,
  teleconsultation,
  coords,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const table = useRef(null);
  const {
    userStore: { user },
  } = useStore();

  const isUserConnected = !!user;

  const goToProfile = (psychologist) => {
    let searchPath = `?page=${page}&name=${nameFilter}&address=${addressFilter}&teleconsultation=${teleconsultation}&language=${languageFilter}`;
    if (coords?.latitude && coords?.longitude) {
      searchPath += `&lat=${coords.latitude}&lon=${coords.longitude}`;
    }
    if (location.search !== searchPath) {
      navigate(`/trouver-un-psychologue${searchPath}`);
    }

    if (__MATOMO__) {
      _paq.push([
        'trackEvent',
        'PsychologistProfile',
        'ViewFromResults',
        psychologist.dossierNumber,
      ]);
    }

    navigate(`/trouver-un-psychologue/${psychologist.dossierNumber}`);
  };

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
          {pagedPsychologists.map((psychologist) => (
            <div
              className={styles.box}
              key={psychologist.dossierNumber}
              data-test-id="psy-row"
            >
              <div className={styles.personnalInfo}>
                <i
                  className={`ri-user-line ${styles.userIcon}`}
                  style={{ fontSize: '2rem' }}
                />
                <div>
                  <h6>
                    {psychologist.lastName.toUpperCase()}{' '}
                    {psychologist.firstNames}
                  </h6>
                  <div className={styles.addressInfo}>
                    <div>
                      <i
                        className="ri-map-pin-2-fill fr-mr-1w"
                        style={{ fontSize: '1.5rem' }}
                      />
                      <span>
                        {psychologist.city
                          ? `${psychologist.city} • ${psychologist.postcode}`
                          : psychologist.address}{' '}
                      </span>
                      {psychologist.otherCity &&
                        psychologist.otherCity !== psychologist.city && (
                          <>
                            <span className={styles.separator} />
                            <span>{`${psychologist.otherCity} • ${psychologist.otherPostcode}`}</span>
                          </>
                        )}
                      {psychologist.distanceToUser && (
                        <span> {psychologist.distanceToUser.toFixed(1)}km</span>
                      )}
                    </div>
                    {psychologist.teleconsultation && (
                      <>
                        <div className={styles.optionalSeparator} />
                        <Badge
                          className={styles.badge}
                          severity="success"
                          noIcon
                        >
                          <i className="ri-webcam-fill fr-mr-1w" />
                          Téléconsultation disponible
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.horizontalSeparator} />
              <div className={styles.contactInfo}>
                {isUserConnected && (
                  <>
                    <Button
                      iconId="fr-icon-mail-fill"
                      priority="tertiary no outline"
                      linkProps={{
                        href: `mailto:${psychologist.email}`,
                      }}
                    />
                    <div className={styles.bigSeparator} />
                    <Button
                      iconId="fr-icon-phone-fill"
                      priority="tertiary no outline"
                      linkProps={{
                        href: `tel:${psychologist.phone}`,
                      }}
                    />
                  </>
                )}
                <Button
                  priority="secondary"
                  nativeButtonProps={{
                    'data-test-id': 'psy-table-row-profil-button',
                    onClick: () => goToProfile(psychologist),
                  }}
                >
                  {isUserConnected
                    ? 'Contacter le psychologue'
                    : 'Accéder à la fiche du psychologue'}
                </Button>
              </div>
            </div>
          ))}

          <Pagination
            count={pageCount}
            defaultPage={currentPage}
            getPageLinkProps={(page) => ({
              onClick: (e) => {
                e.preventDefault();
                setPage(page);
              },
              href: '#',
            })}
          />
        </div>
      )}
    </div>
  );
};

export default PsyTable;
