import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import DatePicker from 'react-datepicker';
import { Button, Select } from '@dataesr/react-dsfr';

import Ariane from 'components/Ariane/Ariane';
import Mail from 'components/Footer/Mail';
import GlobalNotification from 'components/Notification/GlobalNotification';
import DateInput from 'components/Date/DateInput';

import agent from 'services/agent';
import { convertLocalToUTCDate } from 'services/date';

import { useStore } from 'stores/';

import 'react-datepicker/dist/react-datepicker.css';

const NewAppointment = () => {
  const history = useHistory();
  const [date, setDate] = useState();
  const [patientId, setPatientId] = useState();
  const [patients, setPatients] = useState([]);

  const { commonStore: { setNotification } } = useStore();

  useEffect(() => {
    agent.Patient.get()
      .then(response => {
        setPatients(response.patients);
      });
  }, []);

  const createNewAppointment = e => {
    e.preventDefault();
    setNotification({});
    agent.Appointment.add(patientId, date).then(response => {
      history.push('/psychologue/mes-seances');
      setNotification(response);
    });
  };

  return (
    <div className="fr-container fr-mb-3w" data-test-id="new-appointment-container">
      <Ariane
        previous={[
          {
            label: 'Déclarer mes séances',
            url: '/psychologue/mes-seances',
          },
        ]}
        current="Nouvelle séance"
      />
      <h1>
        Nouvelle séance
      </h1>
      <p className="fr-mb-2w">
        Vous avez réalisé une séance avec un étudiant ou une étudiante. Renseignez-la sur cette page.
      </p>
      <GlobalNotification />
      <div className="fr-mb-5w">
        <form onSubmit={createNewAppointment}>
          <div>
            <div className="fr-my-2w">
              <DatePicker
                selected={date}
                dateFormat="dd/MM/yyyy"
                customInput={<DateInput label="Date de la séance" />}
                onChange={newDate => setDate(convertLocalToUTCDate(newDate))}
              />
            </div>

            <div className="fr-select-group">
              <Select
                id="patients"
                name="patientId"
                label="Patient"
                selected={patientId}
                hint={(
                  <>
                    Votre patient n&lsquo;est pas dans la liste ?
                    {' '}
                    <HashLink to="/psychologue/nouveau-patient">Ajoutez un nouveau patient</HashLink>
                  </>
                )}
                onChange={e => { setPatientId(e.target.value); }}
                required
                options={patients.map(patient => (
                  { value: `${patient.id}`, label: `${patient.lastName} ${patient.firstNames}` }
                ))}
              />
            </div>
            <div className="fr-my-5w">
              <Button submit className="fr-fi-add-line fr-btn--icon-left">
                Créer la séance
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Mail />
    </div>
  );
};

export default NewAppointment;
