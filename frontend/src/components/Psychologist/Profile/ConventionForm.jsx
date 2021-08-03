import React, { useEffect, useState } from 'react';
import { Button, RadioGroup, Radio, Select, Alert } from '@dataesr/react-dsfr';

import agent from 'services/agent';
import { useStore } from 'stores/';

const ConventionForm = ({ currentConvention, onConventionUpdated, checkDefaultValue }) => {
  const [universities, setUniversities] = useState([]);
  const [convention, setConvention] = useState();

  const { commonStore: { setNotification }, userStore: { setUser } } = useStore();

  useEffect(() => {
    agent.University.getAll().then(setUniversities);
  }, []);

  useEffect(() => {
    setConvention({
      universityId: currentConvention ? currentConvention.universityId : '',
      isConventionSigned: checkDefaultValue
        ? currentConvention && currentConvention.isConventionSigned
        : '',
    });
  }, [currentConvention]);

  const saveConvention = e => {
    e.preventDefault();
    setNotification({});
    agent.Convention
      .save(convention)
      .then(response => {
        setNotification(response);
        setUser({ convention: response.convention });
        onConventionUpdated();
      });
  };

  const laSorbonne = universities.find(university => university.name === 'La Sorbonne');
  const laSorbonneParisNord = universities.find(university => university.name === 'Sorbonne Paris Nord');
  const isSorbonne = id => (laSorbonneParisNord && id === laSorbonneParisNord.id) || (laSorbonne && id === laSorbonne.id);

  let defaultValueConventionSigned;
  if (convention && convention.isConventionSigned !== '' && convention.isConventionSigned !== undefined) {
    defaultValueConventionSigned = convention.isConventionSigned ? 'true' : 'false';
  }
  return (
    <form data-test-id="convention-form" onSubmit={saveConvention}>
      {convention && (
        <>
          <Select
            className="midlength-input"
            data-test-id="convention-university-select"
            id="university"
            name="university"
            label="Quelle université vous a contacté pour signer la convention ?"
            selected={convention.universityId}
            onChange={e => setConvention({ ...convention, universityId: e.target.value })}
            required
            options={universities
              ? universities.map(university => ({ value: university.id, label: university.name }))
              : []}
          />
          {isSorbonne(convention.universityId) && (
            <Alert
              description="Pensez à vérifier que l'université sélectionnée est exacte.
            Dans le cas de La Sorbonne (75) et Sorbonne Paris Nord (93)."
            />
          )}
          <RadioGroup
            name="convention"
            legend="Avez-vous déjà signé la convention ?"
            hint="Renseignez votre situation actuelle pour que nous puissions vous aider à avancer au besoin.
            Vous pourrez mettre à jour vos réponses plus tard si votre statut change."
            value={defaultValueConventionSigned}
            onChange={value => setConvention({ ...convention, isConventionSigned: value === 'true' })}
            required
          >
            <Radio
              data-test-id="signed-true"
              label="Oui"
              value="true"
            />
            <Radio
              data-test-id="signed-false"
              label="Non"
              value="false"
            />
          </RadioGroup>

          <div className="fr-my-5w">
            <Button
              submit
              data-test-id="update-convention-button"
              className="fr-fi-check-line fr-btn--icon-left"
              disabled={convention.isConventionSigned === '' || convention.universityId === ''}
            >
              Enregistrer
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default ConventionForm;
