import React, { useEffect, useState } from 'react';

import Input from 'components/Form/Input';

const PayingUniversity = ({ universities, currentConvention, updateConvention }) => {
  const [showForm, setShowForm] = useState(!currentConvention);
  const [convention, setConvention] = useState({
    universityId: '',
    isConventionSigned: false,
  });

  useEffect(() => {
    setConvention({
      universityId: currentConvention ? currentConvention.universityId : '',
      isConventionSigned: currentConvention && currentConvention.isConventionSigned
        ? currentConvention.isConventionSigned
        : false,
    });
  }, [currentConvention]);

  const saveConvention = e => {
    e.preventDefault();
    updateConvention(convention);
    setShowForm(false);
  };

  return (
    <div className="fr-mb-3w">
      <h3>Ma convention</h3>
      <div className="fr-mb-3w">
        <p className="fr-mb-1v">
          L&lsquo;université avec laquelle vous signez la convention est celle qui va vous rembourser vos séances.
        </p>
        <p className="fr-mb-1v">
          Elle remboursera pour tous les étudiants, qu&lsquo;ils appartiennent à cette université ou une autre.
        </p>
      </div>
      {showForm ? (
        <>
          {currentConvention && (
          <h4
            data-test-id="convention-form-title"
          >
            Modifier le statut de ma convention
          </h4>
          )}
          <form data-test-id="convention-form" onSubmit={saveConvention}>
            <Input
              data-test-id="convention-university-select"
              id="university"
              name="university"
              type="select"
              label="Quelle université vous a contacté pour signer la convention ?"
              value={convention.universityId || ''}
              onChange={value => setConvention({ ...convention, universityId: value })}
              required
              options={universities.map(university => ({ id: university.id, label: university.name }))}
            />
            <Input
              type="radio"
              value={convention.isConventionSigned}
              field="signed"
              onChange={value => setConvention({ ...convention, isConventionSigned: value })}
              required
              label="Avez-vous déjà signé la convention ?"
              hint="Renseignez votre situation actuelle pour que nous puissions vous aider à avancer au besoin.
              Vous pourrez mettre à jour vos réponses plus tard si votre statut change."
              options={[
                {
                  id: true,
                  label: 'Oui',
                }, {
                  id: false,
                  label: 'Non',
                },
              ]}
            />

            <div className="fr-my-5w">
              <button
                data-test-id="update-convention-button"
                type="submit"
                className="fr-btn fr-fi-check-line fr-btn--icon-left"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h5>Statut de ma convention :</h5>
          <p data-test-id="convention-university-name" className="fr-mb-1v">
            Je suis rattaché à l&lsquo;université de
            {' '}
            <b>{currentConvention ? currentConvention.universityName : ''}</b>
            .
          </p>
          <p data-test-id="convention-signed" className="fr-mb-2w">
            {currentConvention && currentConvention.isConventionSigned ? (
              <>
                La convention est
                {' '}
                <b>signée</b>
                .
              </>
            )
              : (
                <>
                  La convention n&lsquo;est
                  {' '}
                  <b>pas encore signée</b>
                  .
                </>
              )}
          </p>
          <div>
            <p className="fr-mb-2v">Un changement de statut ? Tenez-nous au courant !</p>
            <button
              data-test-id="show-convention-form"
              type="button"
              className="fr-btn fr-fi-edit-line fr-btn--icon-left"
              onClick={() => { setShowForm(true); }}
            >
              Modifier le statut
            </button>
          </div>
        </>
      )}
    </div>

  );
};

export default PayingUniversity;
