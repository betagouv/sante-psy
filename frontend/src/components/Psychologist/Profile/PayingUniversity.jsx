import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from 'stores/';
import { Button } from '@dataesr/react-dsfr';
import ConventionForm from './ConventionForm';

const PayingUniversity = () => {
  const conventionRef = useRef();
  const { userStore: { user } } = useStore();
  const [showForm, setShowForm] = useState();

  useEffect(() => {
    setShowForm(!user.convention);
    conventionRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [user]);

  return (
    <div ref={conventionRef}>
      {showForm ? (
        <>
          {user.convention && (
          <h5 data-test-id="convention-form-title">
            Modifier le statut de ma convention
          </h5>
          )}
          <ConventionForm
            onConventionUpdated={() => { setShowForm(false); }}
            currentConvention={user.convention}
            checkDefaultValue
          />
        </>
      ) : (
        <>
          <h5>Statut de ma convention</h5>
          <Button
            className="fr-mb-1w"
            data-test-id="show-convention-form"
            onClick={() => { setShowForm(true); }}
            icon="fr-fi-edit-line"
          >

            Modifier le statut
          </Button>
          <div data-test-id="convention-university-name">
            Je suis rattaché à l&lsquo;université de
            {' '}
            <b>{user.convention ? user.convention.universityName : ''}</b>
            .
          </div>
          <div data-test-id="convention-signed">
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
          </div>
        </>
      )}
    </div>
  );
};

export default observer(PayingUniversity);
