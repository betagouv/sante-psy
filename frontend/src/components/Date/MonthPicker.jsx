import React, { useRef } from 'react';
import Picker from 'react-month-picker';
import { shortFrenchMonthNames, formatMonth } from 'services/date';

const MonthPicker = ({ month, setMonth, id }) => {
  const calendar = useRef(null);

  return (
    <Picker
      years={{ min: { year: 2021, month: 3 }, max: { year: 2022, month: 12 } }}
      ref={calendar}
      value={month}
      lang={shortFrenchMonthNames}
      onChange={(y, m) => { setMonth({ month: m, year: y }); calendar.current.dismiss(); }}
    >
      <input
        id={id}
        className="fr-input short-input"
        onChange={() => {}}
        onClick={() => calendar.current.show()}
        value={formatMonth(month)}
      />
    </Picker>
  );
};

export default MonthPicker;
