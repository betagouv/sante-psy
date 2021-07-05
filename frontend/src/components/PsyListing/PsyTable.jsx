import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Pagination } from '@dataesr/react-dsfr';
import camelize from 'services/string';

const PsyTable = ({ psychologists }) => {
  const [page, setPage] = useState(1);
  return (
    <>
      <Table
        caption="Trouver un psychologue"
      >
        <thead>
          <tr key="headers">
            <th scope="col">Nom</th>
            <th scope="col">Adresse</th>
            { /* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {
        psychologists
          .slice((page - 1) * 10, page * 10)
          .map(psychologist => (
            <tr key={psychologist.dossierNumber}>
              <td>
                {`${psychologist.lastName.toUpperCase()} ${camelize(psychologist.firstNames)}`}
              </td>
              <td>{psychologist.address}</td>
              <td>
                <Link to={`/psy/${psychologist.dossierNumber}`}>voir le profil</Link>
              </td>
            </tr>
          ))
  }
        </tbody>
      </Table>
      <Pagination
        buildURL={() => {}}
        currentPage={page}
        pageCount={Math.ceil(psychologists.length / 10)}
        surrendingPages={3}
      />
    </>
  );
};

export default PsyTable;
