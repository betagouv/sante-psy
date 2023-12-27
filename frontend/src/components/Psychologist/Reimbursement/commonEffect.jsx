import { useEffect, useCallback } from 'react';
import agent from 'services/agent';

const useAppointmentsByDate = (updateValuesByDate, withPatients = false) => {
  const fetchData = useCallback(() => {
    Promise.all([
      agent.Appointment.get(),
      agent.Appointment.getFirstAppointments(),
    ])
      .then(results => {
        const appointments = results[0];
        const firstAppointments = results[1];

        const appointmentsByDate = {};
        const firstAppointmentsByDate = {};
        const patientsByDate = {};

        appointments.forEach(appointment => {
          const existingValue = appointmentsByDate[appointment.appointmentDate];
          appointmentsByDate[appointment.appointmentDate] = existingValue ? existingValue + 1 : 1;

          if (withPatients) {
            const existingPatients = patientsByDate[appointment.appointmentDate];
            if (existingPatients) {
              existingPatients.push(appointment.patientId);
            } else {
              patientsByDate[appointment.appointmentDate] = [appointment.patientId];
            }
          }
        });

        firstAppointments.forEach(appointment => {
          const existingValue = firstAppointmentsByDate[appointment.appointmentDate];
          firstAppointmentsByDate[appointment.appointmentDate] = existingValue ? existingValue + 1 : 1;
        });

        const updateData = {
          appointments: appointmentsByDate,
          firstAppointments: firstAppointmentsByDate,
        };

        if (withPatients) {
          updateData.patients = patientsByDate;
        }

        updateValuesByDate(updateData);
      });
    // agent.Appointment.get().then(response => {
    //   const appointmentsByDate = {};
    //   const patientsByDate = {};

    //   response.forEach(appointment => {
    //     const existingValue = appointmentsByDate[appointment.appointmentDate];
    //     appointmentsByDate[appointment.appointmentDate] = existingValue ? existingValue + 1 : 1;

    //     const existingPatients = patientsByDate[appointment.appointmentDate];
    //     if (existingPatients) {
    //       existingPatients.push(appointment.patientId);
    //     } else {
    //       patientsByDate[appointment.appointmentDate] = [appointment.patientId];
    //     }
    //   });
    //   agent.Appointment.getFirstAppointments().then(firstAppointments => {
    //     const firstAppointmentsByDate = {};
    //     firstAppointments.forEach(appointment => {
    //       const existingValue = firstAppointmentsByDate[appointment.appointmentDate];
    //       firstAppointmentsByDate[appointment.appointmentDate] = existingValue ? existingValue + 1 : 1;
    //     });

    //     const updateData = {
    //       appointments: appointmentsByDate,
    //       firstAppointments: firstAppointmentsByDate,
    //     };

    //     if (withPatients) {
    //       updateData.patients = patientsByDate;
    //     }

    //     updateValuesByDate(updateData);
    //   });
    // });
  }, [updateValuesByDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
};

export default useAppointmentsByDate;
