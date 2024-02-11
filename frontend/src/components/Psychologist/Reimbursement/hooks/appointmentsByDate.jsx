import { useEffect, useCallback } from 'react';
import agent from 'services/agent';
import appointmentBadges from 'src/utils/badges';

const useAppointmentsByDate = (updateValuesByDate, withPatients = false) => {
  const fetchData = useCallback(() => {
    agent.Appointment.get({ includeBadges: true, isBillingPurposes: true })
      .then(result => {
        const appointments = result;

        const appointmentsByDate = {};
        const patientsByDate = {};

        appointments.forEach(appointment => {
          if (!appointmentsByDate[appointment.appointmentDate]) {
            appointmentsByDate[appointment.appointmentDate] = {};
          }
          if (appointment.badge === appointmentBadges.max) {
            appointment.badge = appointmentBadges.other;
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
    fetchData();
  }, [fetchData]);
};

export default useAppointmentsByDate;
