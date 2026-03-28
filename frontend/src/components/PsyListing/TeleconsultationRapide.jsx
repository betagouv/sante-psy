import React, { useState } from 'react';
import { Alert, Button } from '@dataesr/react-dsfr';
import agent from 'services/agent';

const DAYS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

const formatSlot = isoSlot => {
  try {
    const d = new Date(isoSlot);
    const day = DAYS_FR[d.getDay()];
    const month = MONTHS_FR[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${d.getDate()} ${month} ${d.getFullYear()} à ${hours}h${minutes}`;
  } catch {
    return isoSlot;
  }
};

const TeleconsultationRapide = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [stale, setStale] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await agent.Psychologist.fastestTeleconsultation();
      if (data.blocked) {
        setBlocked(true);
        return;
      }
      setBlocked(false);
      setResults(data.results);
      setStale(data.stale);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Si Doctolib bloque le serveur, on masque entièrement le composant
  if (blocked) {
    return null;
  }

  return (
    <div className="fr-mb-4w">
      <Button
        onClick={handleClick}
        disabled={loading}
        icon="ri-time-line"
        iconPosition="left"
        secondary
      >
        {loading ? 'Recherche en cours…' : 'Voir les premières disponibilités en téléconsultation'}
      </Button>

      {loading && (
        <p className="fr-mt-2w fr-text--sm fr-hint-text">
          Interrogation de Doctolib… Cette opération peut prendre quelques secondes.
        </p>
      )}

      {error && (
        <Alert
          className="fr-mt-2w"
          type="error"
          description="Impossible de récupérer les disponibilités pour le moment. Veuillez réessayer."
        />
      )}

      {stale && !loading && (
        <Alert
          className="fr-mt-2w"
          type="info"
          description="Ces résultats proviennent du dernier scan (il y a plus de 15 minutes). Une mise à jour est en cours en arrière-plan."
        />
      )}

      {results && results.length === 0 && !loading && (
        <Alert
          className="fr-mt-2w"
          type="warning"
          description="Aucun créneau de téléconsultation disponible n'a été trouvé pour le moment."
        />
      )}

      {results && results.length > 0 && (
        <div className="fr-mt-3w">
          <h3 className="fr-h5">
            {results.length === 1
              ? '1 psychologue disponible en téléconsultation'
              : `${results.length} psychologues disponibles en téléconsultation`}
          </h3>
          <ul className="fr-raw-list">
            {results.map((psy, index) => (
              <li key={psy.psychologistId} className="fr-mb-2w">
                <div className="fr-card fr-card--sm fr-card--no-arrow fr-p-2w">
                  <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
                    <div className="fr-col-auto">
                      <span
                        className="fr-badge fr-badge--blue-cumulus"
                        aria-label={`Rang ${index + 1}`}
                      >
                        {`#${index + 1}`}
                      </span>
                    </div>
                    <div className="fr-col">
                      <p className="fr-text--bold fr-mb-0">{psy.psychologistName}</p>
                      {psy.nextSlot ? (
                        <p className="fr-text--sm fr-mb-0">
                          <span className="fr-icon-calendar-line fr-icon--sm" aria-hidden="true" />
                          {' '}
                          {formatSlot(psy.nextSlot)}
                        </p>
                      ) : (
                        <p className="fr-text--sm fr-mb-0 fr-hint-text">
                          Disponibilité non vérifiée
                        </p>
                      )}
                    </div>
                    <div className="fr-col-auto">
                      <a
                        href={psy.doctolibUrl}
                        className="fr-btn fr-btn--sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Prendre rendez-vous
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeleconsultationRapide;
