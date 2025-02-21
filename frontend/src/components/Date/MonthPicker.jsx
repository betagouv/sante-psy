import React from 'react';
import DatePicker from 'react-datepicker';
import { endYearOfCurrentUnivYear } from 'services/univYears';

const MonthPicker = ({ month, setMonth }) => {
  const handleChange = date => {
    setMonth({ month: date.getMonth() + 1, year: date.getFullYear() });
  };

  const renderMonthContent = (month, shortMonth, longMonth, day) => {
    const fullYear = new Date(day).getFullYear();
    const tooltipText = `${longMonth} ${fullYear}`;

    return <span title={tooltipText}>{shortMonth}</span>;
  };

  const minDate = new Date(2021, 2, 1);
  const maxDate = new Date(endYearOfCurrentUnivYear(), 11, 31);

  return (
    <div className="monthPicker">
      <DatePicker
        selected={new Date(month.year, month.month - 1)}
        onChange={handleChange}
        showMonthYearPicker
        dateFormat="MMMM yyyy"
        renderMonthContent={renderMonthContent}
        className="fr-input short-input"
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>

  );
};

export default MonthPicker;
