import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Pagination, Button, Title } from '@dataesr/react-dsfr';
import camelize from 'services/string';

const PsyTable = ({ page, setPage, psychologists, nameFilter, addressFilter, teleconsultation }) => {
  const history = useHistory();
  const table = useRef(null);

  const goToProfile = psychologist => {
    const searchPath = `?page=${
      page}&name=${
      nameFilter}&address=${
      addressFilter}&teleconsultation=${
      teleconsultation}`;
    if (history.location.search !== searchPath) {
      history.push(`/trouver-un-psychologue${searchPath}`);
    }
    history.push(`/trouver-un-psychologue/${psychologist.dossierNumber}`);
  };

  return (
    <>
      {psychologists.length > 0 ? (
        <>
          <Table
            data-test-id="psy-table"
            className="fr-mb-3w"
            caption="Tous les résultats"
          >
            <thead ref={table}>
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
                    <td>
                      {psychologist.address}
                    </td>
                    <td>
                      <div className="fr-displayed-xs fr-hidden-sm">
                        <Button
                          data-test-id="psy-table-row-profil-button"
                          secondary
                          size="sm"
                          onClick={() => goToProfile(psychologist)}
                          className="fr-fi-arrow-right-line fr-float-right"
                        />
                      </div>
                      <div className="fr-hidden-xs fr-displayed-sm">
                        <Button
                          data-test-id="psy-table-row-profil-button"
                          secondary
                          size="sm"
                          onClick={() => goToProfile(psychologist)}
                          className="fr-fi-arrow-right-line fr-btn--icon-right fr-float-right"
                        >
                          Voir le profil
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Pagination
            currentPage={Math.min(page, Math.ceil(psychologists.length / 10))}
            onClick={p => {
              setPage(p);
              table.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }}
            pageCount={Math.ceil(psychologists.length / 10)}
            surrendingPages={0}
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
