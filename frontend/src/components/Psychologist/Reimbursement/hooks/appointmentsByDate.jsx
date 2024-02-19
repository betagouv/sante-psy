import { useEffect, useCallback } from 'react';
import agent from 'services/agent';
import appointmentBadges from 'src/utils/badges';

const useAppointmentsByDate = (updateValuesByDate, month, withPatients = false) => {
  const fetchData = useCallback(month => {
    agent.Appointment.get({ isBillingPurposes: true, month: month.month, year: month.year })
      .then(result => {
        const appointments = result;

        const appointmentsByDate = {};
        const patientsByDate = {};

        appointments.forEach(appointment => {
          if (!appointmentsByDate[appointment.appointmentDate]) {
            appointmentsByDate[appointment.appointmentDate] = {};
          }
          const existingValue = appointmentsByDate[appointment.appointmentDate][appointment.badge];
          appointmentsByDate[appointment.appointmentDate][appointment.badge] = existingValue ? existingValue + 1 : 1;

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
