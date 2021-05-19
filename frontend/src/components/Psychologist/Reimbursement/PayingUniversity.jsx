import React, { useEffect, useState } from 'react';

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
          {currentConvention && <h4>Modifier le statut de ma convention</h4>}
          <form onSubmit={saveConvention}>
            <div className="fr-select-group">
              <label className="fr-label" htmlFor="university">
                Quelle université vous a contacté pour signer la convention ?
                <span className="red-text">*</span>
              </label>
              <select
                value={convention.universityId || ''}
                onChange={e => setConvention({ ...convention, universityId: e.target.value })}
                className="fr-select"
                id="university"
                name="university"
                required
              >
                <option value="" disabled hidden>- Cliquez pour choisir -</option>
                {universities.map(university => (
                  <option
                    key={university.id}
                    value={university.id}
                  >
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="fr-form-group">
              <fieldset className="fr-fieldset">
                <legend className="fr-label fr-mb-1w">
                  Avez-vous déjà signé la convention ?
                  <span className="red-text">*</span>
                  <span className="fr-hint-text">
                    Renseignez votre situation actuelle pour que nous puissions vous aider à avancer au besoin.
                    Vous pourrez mettre à jour vos réponses plus tard si votre statut change.
                  </span>
                </legend>
                <div className="fr-fieldset__content">
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="signed-yes"
                      name="signed"
                      required
                      checked={convention.isConventionSigned}
                      onChange={() => setConvention({ ...convention, isConventionSigned: true })}
                    />
                    <label className="fr-label" htmlFor="signed-yes">Oui</label>
                  </div>
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="signed-no"
                      name="signed"
                      required
                      checked={!convention.isConventionSigned}
                      onChange={() => setConvention({ ...convention, isConventionSigned: false })}
                    />
                    <label className="fr-label" htmlFor="signed-no">Non, pas encore</label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="fr-my-5w">
              <button type="submit" className="fr-btn fr-fi-check-line fr-btn--icon-left">Enregistrer</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h5>Statut de ma convention :</h5>
          <p className="fr-mb-1v">
            Je suis rattaché à l&lsquo;université de
            {' '}
            <b>{currentConvention.universityName}</b>
            .
          </p>
          <p className="fr-mb-2w">
            {currentConvention.isConventionSigned ? (
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
