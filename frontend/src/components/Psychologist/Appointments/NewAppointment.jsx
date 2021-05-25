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
              <label className="fr-label" htmlFor="patients" aria-describedby="patients-help">Patient</label>
              <div className="fr-hint-text" id="patients-help">
                Votre patient n&lsquo;est pas dans la liste ?
                {' '}
                <HashLink to="/psychologue/nouveau-patient">Ajoutez un nouveau patient</HashLink>
              </div>
              <select
                className="fr-select"
                id="patients"
                name="patientId"
                defaultValue=""
                onChange={event => { setPatientId(event.target.value); }}
                required
              >
                <option value="" disabled hidden>- Select -</option>
                {patients.map(patient => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {`${patient.lastName} ${patient.firstNames}`}
                  </option>
                ))}
              </select>
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
