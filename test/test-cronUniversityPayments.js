/* eslint-disable max-len */
const { assert } = require('chai');
const cronUniversityPayments = require('../cron_jobs/cronUniversityPayments');

describe('getSummariesForUniversities', () => {
  it('should getSummariesForUniversities', () => {
    const monthlyAppointmentSummary = [
      {
        countAppointments: 3, psychologistId: 'psy-id-1', universityId: 'univ-id-1', firstNames: 'Jean', lastName: 'Jacques', personalEmail: 'test@email.com',
      },
      {
        countAppointments: 2, psychologistId: 'psy-id-2', universityId: 'univ-id-1', firstNames: 'Jean', lastName: 'Jacques', personalEmail: 'test@email.com',
      },
      {
        countAppointments: 4, psychologistId: 'psy-id-3', universityId: 'univ-id-2', firstNames: 'Jean', lastName: 'Jacques', personalEmail: 'test@email.com',
      },
    ];

    const summaries = cronUniversityPayments.getSummariesForUniversities(monthlyAppointmentSummary);

    /*
      Expected output : 
      summaries = {
        'univ-id-1': [
          { psychologistId: 'psy-id-1', countAppointments: 3, firstNames, lastName, personalEmail },
          { psychologistId: 'psy-id-2', countAppointments: 2, firstNames lastName, personalEmail }         
        ],
        'univ-id-2': [
          { psychologistId: 'psy-id-3', countAppointments: 4, firstNames, lastName, personalEmail },
        ]
      }
    */
    assert.equal(summaries['univ-id-1'].length, 2); // 2 psys for univ 1
    // psy 1 with appointments
    assert.equal(summaries['univ-id-1'][0].psychologistId, 'psy-id-1');
    assert.equal(summaries['univ-id-1'][0].countAppointments, 3);
    // psy 2 with appointments
    assert.equal(summaries['univ-id-1'][1].psychologistId, 'psy-id-2');
    assert.equal(summaries['univ-id-1'][1].countAppointments, 2);

    assert.equal(summaries['univ-id-2'].length, 1); // 1 psy for univ 2
    // psy 3 with appointments
    assert.equal(summaries['univ-id-2'][0].psychologistId, 'psy-id-3');
    assert.equal(summaries['univ-id-2'][0].countAppointments, 4);
  });
});
