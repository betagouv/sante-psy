import React from 'react';

import Ariane from 'components/Ariane/Ariane';
import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';
import Input from 'components/Form/Input';

import { REGIONS, DEPARTEMENTS } from 'services/geo';

const EditProfile = ({ psychologist, changePsychologist, save, loading }) => (
  <div className="fr-container fr-mb-3w fr-mt-2w">
    <Ariane
      previous={[
        {
          label: 'Mes informations',
          url: '/psychologue/mon-profil',
        }]}
      current="Modifier mes informations"
    />
    <h1>Modifier mes informations</h1>
    <GlobalNotification />
    {!loading && (
      <div className="fr-my-3w">
        <form data-test-id="edit-profile-form" onSubmit={save}>
          <p className="fr-text--sm fr-mb-1v">
            Les champs avec une astérisque (
            <span className="red-text">*</span>
            ) sont obligatoires.
          </p>
          <Input
            label="Email personnel"
            hint="Adresse non communiquée sur l'annuaire, utilisée uniquement pour la réception de mail provenant de
             Santé Psy Etudiant."
            type="text"
            field="personalEmail"
            value={psychologist.personalEmail}
            onChange={changePsychologist}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            placeholder="exemple@beta.gouv.fr"
            required
          />

          <h2>Informations pour l&lsquo;annuaire</h2>
          <Input
            label="Votre département"
            type="select"
            field="departement"
            value={psychologist.departement}
            onChange={changePsychologist}
            options={DEPARTEMENTS.map(departement => ({ id: departement, label: departement }))}
            data-test-id="departement-select"
            required
          />
          <Input
            label="Votre région"
            type="select"
            field="region"
            value={psychologist.region}
            onChange={changePsychologist}
            options={REGIONS.map(region => ({ id: region, label: region }))}
            data-test-id="region-select"
            required
          />
          <Input
            label="Adresse du cabinet"
            hint="Adresse où se rendre pour le rendez-vous."
            type="text"
            field="address"
            value={psychologist.address}
            onChange={changePsychologist}
            required
          />
          <Input
            label="Téléphone du secrétariat"
            hint="Numéro auquel prendre rendez-vous."
            type="text"
            field="phone"
            value={psychologist.phone}
            onChange={changePsychologist}
            required
          />
          <Input
            label="Email de contact"
            hint="Adresse email à laquelle prendre rendez-vous ou poser des questions."
            type="text"
            field="email"
            value={psychologist.email}
            onChange={changePsychologist}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            placeholder="exemple@beta.gouv.fr"
          />
          <Input
            type="radio"
            value={psychologist.teleconsultation}
            field="teleconsultation"
            onChange={value => changePsychologist(value, 'teleconsultation')}
            label="Proposez-vous de la téléconsultation ?"
            hint="Par téléphone ou par appel vidéo (Skype, Whatsapp, Teams, ...)"
            options={[
              {
                id: true,
                label: 'Oui',
              }, {
                id: false,
                label: 'Non',
              },
            ]}
          />
          <Input
            label="Langues parlées"
            hint="Exemple : &ldquo;Français, Anglais&rdquo;"
            type="text"
            field="languages"
            value={psychologist.languages}
            onChange={changePsychologist}
            required
          />
          <Input
            label="Site web professionnel"
            hint="Site sur lequel l'étudiant pourra trouver plus d'info sur votre cabinet ou vos services."
            type="text"
            field="website"
            value={psychologist.website}
            onChange={changePsychologist}
          />
          <Input
            label="Paragraphe de présentation"
            hint="Ex : &ldquo;Je propose du suivi pour les jeunes adultes, en particulier pour la gestion du stress et
            de l'anxiété.&rdquo;"
            type="textarea"
            field="description"
            value={psychologist.description}
            onChange={changePsychologist}
          />
          <div className="fr-my-5w">
            <button
              data-test-id="save-profile-button"
              type="submit"
              className="fr-btn fr-btn--icon-left fr-fi-check-line"
            >
              Valider les modifications
            </button>
          </div>
        </form>
      </div>
    )}
    <Mail />
  </div>
);

export default EditProfile;
