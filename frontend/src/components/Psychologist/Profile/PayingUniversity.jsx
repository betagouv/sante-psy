import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from 'stores/';
import ConventionForm from './ConventionForm';

const PayingUniversity = () => {
  const { userStore: { user } } = useStore();
  const [showForm, setShowForm] = useState();

  useEffect(() => {
    setShowForm(!user.convention);
  }, [user]);
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
          {user.convention && (
          <h4
            data-test-id="convention-form-title"
          >
            Modifier le statut de ma convention
          </h4>
          )}
          <ConventionForm
            onConventionUpdated={() => { setShowForm(false); }}
            currentConvention={user.convention}
            checkDefaultValue
          />
        </>
      ) : (
        <>
          <h5>Statut de ma convention :</h5>
          <p data-test-id="convention-university-name" className="fr-mb-1v">
            Je suis rattaché à l&lsquo;université de
            {' '}
            <b>{user.convention ? user.convention.universityName : ''}</b>
            .
          </p>
          <p data-test-id="convention-signed" className="fr-mb-2w">
            {user.convention && user.convention.isConventionSigned ? (
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

export default observer(PayingUniversity);
