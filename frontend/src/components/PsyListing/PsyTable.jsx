import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Pagination, Button, Title } from '@dataesr/react-dsfr';
import camelize from 'services/string';

const PsyTable = ({ psychologists, filter, teleconsultation }) => {
  const history = useHistory();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filter, teleconsultation]);

  return (
    <>
      {psychologists.length > 0 ? (
        <>
          <Table
            data-test-id="psy-table"
            className="fr-mb-3w"
            caption="Tous les résultats"
          >
            <thead>
              <tr key="headers">
                <th scope="col">Nom</th>
                <th scope="col">Adresse</th>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {psychologists
                .slice((page - 1) * 10, page * 10)
                .map(psychologist => (
                  <tr
                    data-test-id="psy-table-row"
                    key={psychologist.dossierNumber}
                  >
                    <td>
                      {`${psychologist.lastName.toUpperCase()} ${camelize(
                        psychologist.firstNames,
                      )}`}
                    </td>
                    <td>{psychologist.address}</td>
                    <td>
                      <Button
                        data-test-id="psy-table-row-profil-button"
                        secondary
                        onClick={() => {
                          const searchPath = `?search=${filter}&teleconsultation=${teleconsultation}`;
                          if (history.location.search !== searchPath) {
                            history.push(`/trouver-un-psychologue${searchPath}`);
                          }
                          history.push(`/trouver-un-psychologue/${psychologist.dossierNumber}`);
                        }}
                        className="fr-fi-arrow-right-line fr-btn--icon-right fr-float-right"
                      >
                        Voir le profil
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Pagination
            currentPage={Math.min(page, Math.ceil(psychologists.length / 10))}
            onClick={setPage}
            pageCount={Math.ceil(psychologists.length / 10)}
            surrendingPages={3}
          />
        </>
      ) : (
        <Title as="h4" look="h4">
          Aucun résultat n&lsquo;a été trouvé, veuillez élargir votre champ de recherche
        </Title>
      )}
    </>
  );
};

export default PsyTable;
