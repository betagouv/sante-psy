import React from 'react';
import { getUnivYear } from 'services/univYears';

export const InputCertificate = ({ setFile, fileError }) => (
    <>
      <h2 className="fr-mt-3w">
        Ajoute ton attestation CVEC pour l'année {getUnivYear(new Date(), '-')}
      </h2>
      <img src="/images/icons/file.svg" alt="" />
      <p className="fr-mb-1v">
        Si tu n'en as pas ajoute ton certificat de scolarité.
      </p>
      {fileError && (
        <div className="fr-alert fr-alert--error fr-mb-2w">
          <h3 className="fr-alert__title">Erreur</h3>
          <p>{fileError}</p>
        </div>
      )}
      <div className="fr-my-2w">
        <label className="fr-label" htmlFor="file-upload">
          Ajouter un fichier (.jpg, .pdf, .png)
        </label>
        <input
          className="fr-input"
          id="file-upload"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          placeholder="Formats supportés : .jpg, .png, .pdf. Un seul fichier possible."
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
    </>
  );
