import { useEffect, useCallback } from 'react';
import agent from 'services/agent';
import getBadgeInfos from 'src/utils/badges';

const useAppointmentsByDate = (updateValuesByDate, month, withPatients = false) => {
  const badges = getBadgeInfos();
  const fetchData = useCallback(selectedMonth => {
    agent.Appointment.get({ isBillingPurposes: true, month: selectedMonth.month, year: selectedMonth.year })
      .then(result => {
        const appointments = result;

        const appointmentsByDate = {};
        const patientsByDate = {};

        appointments.forEach(appointment => {
          if (!appointmentsByDate[appointment.appointmentDate]) {
            appointmentsByDate[appointment.appointmentDate] = {};
          }
          const existingValue = appointmentsByDate[appointment.appointmentDate][appointment.badges[0] ?? badges.other.key];
          appointmentsByDate[appointment.appointmentDate][appointment.badges[0] ?? badges.other.key] = existingValue ? existingValue + 1 : 1;

          if (withPatients) {
            const existingPatients = patientsByDate[appointment.appointmentDate];
            if (existingPatients) {
              existingPatients.push(appointment.patientId);
            } else {
              patientsByDate[appointment.appointmentDate] = [appointment.patientId];
            }
          }
        });

        const updateData = { appointments: appointmentsByDate };

        if (withPatients) {
          updateData.patients = patientsByDate;
        }

        updateValuesByDate(updateData);
      });
  }, [updateValuesByDate]);

  useEffect(() => {
    fetchData(month);
  }, [fetchData, month]);
};

export default useAppointmentsByDate;
