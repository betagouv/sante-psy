import React, { useEffect, useState } from 'react';
import agent from 'services/agent';
import { currentUnivYear } from 'services/univYears';
import { Link } from 'react-router-dom';
import styles from './studentHistory.cssmodule.scss';

const MAX_SESSIONS = 12;

const StudentHistory = () => {
  const [appointments, setAppointments] = useState({});
  const [currentYear, setCurrentYear] = useState(currentUnivYear('-'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    agent.Student.getAppointments()
      .then(res => {
        const data = res || {};
        setAppointments(data);

        const years = Object.keys(data);
        if (years.includes(currentUnivYear('-'))) {
          setCurrentYear(currentUnivYear('-'));
        } else if (years.length) {
          const sorted = years.sort((a, b) => {
            const aEnd = parseInt(a.split('-')[1], 10);
            const bEnd = parseInt(b.split('-')[1], 10);
            return bEnd - aEnd;
          });
          setCurrentYear(sorted[0]);
        }
      })
      .catch(() => setError('Impossible de charger vos rendez-vous.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p aria-live="polite">Chargement de vos rendez-vous…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  const univYears = Object.keys(appointments).sort((a, b) => {
    const aEnd = parseInt(a.split('-')[1], 10);
    const bEnd = parseInt(b.split('-')[1], 10);
    return bEnd - aEnd;
  });

  const currentIndex = univYears.indexOf(currentYear);
  const prevYear = currentIndex < univYears.length - 1 ? univYears[currentIndex + 1] : null;
  const nextYear = currentIndex > 0 ? univYears[currentIndex - 1] : null;

  const yearAppointments = appointments[currentYear] || [];
  const [startYear, endYear] = currentYear.split('-');

  return (
    <section className={styles.historyContainer}>
      <header className={styles.title}>
        <span className="fr-icon-calendar-line fr-color" aria-hidden="true" />
        <h3>
          Année
          {' '}
          {currentYear}
        </h3>
      </header>

      <p className={styles.period}>
        Du 1er septembre
        {' '}
        {startYear}
        {' '}
        au 31 août
        {' '}
        {endYear}
      </p>

      <p className={styles.counter}>
        {yearAppointments.length}
        {' '}
        séances consommées sur
        {' '}
        {MAX_SESSIONS}
      </p>

      {yearAppointments.length > 0 ? (
        <>
          <div
            className={styles.grid}
            role="list"
            aria-label={`Séances de l'année universitaire ${currentYear}`}
          >
            {yearAppointments.map((appt, index) => (
              <div
                key={appt.id}
                className={styles.card}
                role="listitem"
              >
                <div className={styles.index} aria-hidden="true">
                  {index + 1}
                </div>
                <div>
                  <p className={styles.day}>
                    {appt.appointmentDate.split(' ')[0]}
                  </p>
                  <p className={styles.date}>
                    {appt.appointmentDate.split(' ').slice(1).join(' ')}
                  </p>
                  <p className={styles.psychologist}>
                    {appt.psychologistName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <nav className={styles.navigation} aria-label="Navigation entre années universitaires">
            {prevYear ? (
              <button
                type="button"
                className="fr-btn fr-btn--secondary"
                onClick={() => setCurrentYear(prevYear)}
              >
                <span className="fr-icon-arrow-left-s-first-line" aria-hidden="true" />
                {' '}
                Année
                {' '}
                {prevYear}
              </button>
            ) : <span />}

            {nextYear ? (
              <button
                type="button"
                className="fr-btn fr-btn--secondary"
                onClick={() => setCurrentYear(nextYear)}
              >
                Année
                {' '}
                {nextYear}
                {' '}
                <span className="fr-icon-arrow-right-s-last-line" aria-hidden="true" />
              </button>
            ) : <span />}
          </nav>

        </>
      ) : (
        <div className={styles.empty}>
          <p>
            Tes séances consommées apparaîtront ici si tu indiques ton adresse email à ton psychologue.
          </p>
        </div>
      )}

      <button
        type="button"
        className="fr-btn fr-btn--secondary"
        onClick={() => setShowHelp(!showHelp)}
        aria-expanded={showHelp}
          >
        Tes séances n&apos;apparaissent pas ?
      </button>

      {showHelp && (
      <ul className={styles.help}>
        <li>les séances futures n&apos;apparaissent pas</li>
        <li>ton psychologue n&apos;a peut-être pas encore déclaré toutes les séances</li>
        <li>vérifie avec ton psychologue qu&apos;il a bien indiqué la bonne adresse email</li>
        <li>vérifie les informations avec ton psychologue : nom, prénom, date de naissance, numéro INE,...</li>
        <li>cela ne fonctionne toujours pas ? tu n&apos;es pas d&apos;accord avec ton compte de séances ?</li>
        <Link to="/contact/formulaire">Contacter le support</Link>
      </ul>
      )}
    </section>
  );
};

export default StudentHistory;
