import React, { useEffect, useState, forwardRef } from 'react';
import { useHistory } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import DatePicker from 'react-datepicker';

import Ariane from 'components/Ariane/Ariane';
import Mail from 'components/Footer/Mail';
import GlobalNotification from 'components/Notification/GlobalNotification';
import agent from 'services/agent';

import { useStore } from 'stores/';

import 'react-datepicker/dist/react-datepicker.css';
import Select from 'components/Form/Select';

const DateInput = forwardRef(({ value, onClick }, ref) => (
  <div onClick={onClick} ref={ref}>
    <label className="fr-label" htmlFor="date">Date de la séance</label>
    <input
      className="fr-input short-input"
      type="text"
      id="date"
      name="date"
      required
      autoComplete="off"
      onChange={() => {}}
      value={value}
    />
  </div>
));

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
        if (!response.success) {
          setNotification(response);
        }
      });
  }, []);

  const createNewPatient = e => {
    e.preventDefault();
    setNotification({});
    agent.Appointment.add(patientId, date).then(response => {
      if (response.success) {
        history.push('/psychologue/mes-seances');
      }
      setNotification(response);
    });
  };

  return (
    <div className="fr-container fr-mb-3w">
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
        <form onSubmit={createNewPatient}>
          <div>
            <div className="fr-my-2w">
              <DatePicker
                selected={date}
                dateFormat="dd/MM/yyyy"
                customInput={<DateInput />}
                onChange={newDate => setDate(newDate)}
              />
            </div>

            <div className="fr-select-group">
              <Select
                id="patients"
                name="patientId"
                label="Patient"
                hint={(
                  <>
                    Votre patient n&lsquo;est pas dans la liste ?
                    {' '}
                    <HashLink to="/psychologue/nouveau-patient">Ajoutez un nouveau patient</HashLink>
                  </>
                )}
                defaultValue=""
                onChange={value => { setPatientId(value); }}
                required
                hiddenOption="- Select -"
                options={patients.map(patient => (
                  { id: patient.id, label: `${patient.lastName} ${patient.firstNames}` }
                ))}
              />
            </div>
            <div className="fr-my-5w">
              <button
                type="submit"
                className="fr-btn fr-fi-add-line fr-btn--icon-left"
              >
                Créer la séance
              </button>
            </div>
          </div>
        </form>
      </div>
      <Mail />
    </div>
  );
};

export default NewAppointment;
