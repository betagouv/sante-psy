import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';
import Input from 'components/Form/Input';

import agent from 'services/agent';

import { useStore } from 'stores';

const EditProfile = () => {
  const { commonStore: { setNotification } } = useStore();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [psychologist, setPsychologist] = useState();
  useEffect(() => {
    agent.Psychologist.me().then(response => {
      if (response.success) {
        setPsychologist({ ...response.psychologist });
        setLoading(false);
      } else {
        history.goBack();
        setNotification(response);
      }
    });
  }, []);

  const save = e => {
    e.preventDefault();
    agent.Psychologist.update(psychologist).then(response => {
      if (response.success) {
        history.push('/psychologue/mes-seances');
      } else {
        window.scrollTo(0, 0);
      }
      setNotification(response);
    });
  };

  const changePsychologist = (value, field) => {
    setPsychologist({ ...psychologist, [field]: value });
  };

  return (
    <div className="fr-container fr-mb-3w fr-mt-2w">
      <h1>Modifier mes informations</h1>
      <GlobalNotification />
      {!loading && (
      <div className="fr-my-3w">
        <form onSubmit={save}>
          <p className="fr-text--sm fr-mb-1v">
            Les champs avec une astérisque (
            <span className="red-text">*</span>
            ) sont obligatoires.
          </p>
          <Input
            label="Email personnel"
            hint="Exemple : exemple@beta.gouv.fr"
            type="text"
            field="personalEmail"
            value={psychologist.personalEmail}
            onChange={changePsychologist}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            placeholder="exemple@beta.gouv.fr"
          />

          <h2>Informations pour l&lsquo;annuaire</h2>
          <Input
            label="Votre département"
            type="text"
            field="department"
            value={psychologist.department}
            onChange={changePsychologist}
          />
          <Input
            label="Votre région"
            type="text"
            field="region"
            value={psychologist.region}
            onChange={changePsychologist}
          />
          <Input
            label="Adresse du cabinet"
            type="text"
            field="address"
            value={psychologist.address}
            onChange={changePsychologist}
          />
          <Input
            label="Téléphone du secrétariat"
            type="text"
            field="phone"
            value={psychologist.phone}
            onChange={changePsychologist}
          />
          <Input
            label="Email de contact"
            hint="Exemple : exemple@beta.gouv.fr"
            type="text"
            field="email"
            value={psychologist.email}
            onChange={changePsychologist}
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            placeholder="exemple@beta.gouv.fr"
          />
          <Input
            label="Je propose de la téléconsultation"
            type="checkbox"
            field="teleconsultation"
            value={psychologist.teleconsultation}
            onChange={changePsychologist}
          />
          <Input
            label="Langues parlées"
            type="text"
            field="languages"
            value={psychologist.languages}
            onChange={changePsychologist}
          />
          <Input
            label="Site web professionnel"
            type="text"
            field="website"
            value={psychologist.website}
            onChange={changePsychologist}
          />
          <Input
            label="Paragraphe de présentation"
            type="textarea"
            field="description"
            value={psychologist.description}
            onChange={changePsychologist}
          />
          <div className="fr-my-5w">
            <button
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
};

export default EditProfile;
