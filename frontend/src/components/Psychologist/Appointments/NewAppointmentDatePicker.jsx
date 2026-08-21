import React from 'react';
import { HashLink } from 'react-router-hash-link';
import DatePicker from 'react-datepicker';

import DateInput from 'components/Date/DateInput';

import { convertLocalToUTCDate, getFirstDayOfLastMonth } from 'services/date';

import 'react-datepicker/dist/react-datepicker.css';

const NewAppointmentDatePicker = ({ date, setDate }) => {
  const beginningDate = getFirstDayOfLastMonth();
  const maxDate = new Date();
  return (
    <DatePicker
      id="new-appointment-date-input"
      className="date-picker"
      selected={date}
      minDate={beginningDate}
      maxDate={maxDate}
      dateFormat="dd/MM/yyyy"
      showPopperArrow={false}
      customInput={
        <DateInput
          label="Date de la séance"
          hint={
            <>
              Les séances doivent être déclarées au plus tard le dernier jour du
              mois suivant leur réalisation. Pour toute aide,{' '}
              <HashLink to="/contact/formulaire">
                contactez le support.
              </HashLink>
            </>
          }
          dataTestId="new-appointment-date-input"
        />
      }
      onChange={(newDate) => setDate(convertLocalToUTCDate(newDate))}
      required
    />
  );
};

export default NewAppointmentDatePicker;
