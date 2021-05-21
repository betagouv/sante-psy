import React, { useEffect, useState } from 'react';

import GlobalNotification from 'components/Notification/GlobalNotification';
import Mail from 'components/Footer/Mail';

const EditProfile = () => {

  const save = e => {
    e.preventDefault();
    console.debug("saving...");
  };

  return (
    <div className="fr-container fr-mb-3w">
      <h1>Modifier mes informations</h1>
      <GlobalNotification />
      <div className="fr-my-3w">
    <form onSubmit={save}>
      <p className="fr-text--sm fr-mb-1v">
        Les champs avec une astérisque (<span className="red-text">*</span>) sont obligatoires.
      </p>
      <div>
        <div className="fr-my-3w">
          <label className="fr-label" htmlFor="firstNames">
            Prénoms 
          {' '}
          <span className="red-text">*</span>
          </label>
          <input 
          className="fr-input midlength-input" 
          value=""
          type="text" 
          id="firstnames" 
          name="firstnames" 
          required />
        </div>
        {/* From https://github.com/betagouv/sante-psy/blob/78f9166a060ea66a89ccaf4e19f21abd04310336/views/editProfil.ejs */}
        {/*
        <div className="fr-my-3w">
          <label className="fr-label" htmlFor="lastName">Nom <span className="red-text">*</span></label>
          <input className="fr-input midlength-input" value="<%= psy[0].lastName %>"  type="text" id="lastName" name="lastName" required>
        </div>

        <div class="fr-my-3w">
          <label class="fr-label" for="personalEmail">Email personnel</label>
          <div class="fr-hint-text" id="personalEmail-help">
            Exemple : exemple@beta.gouv.fr
          </div>
          <input class="fr-input midlength-input" value="<%= psy[0].personalEmail %>"
          type="text"
          pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
          placeholder="exemple@beta.gouv.fr"
          id="personalEmail" name="personalEmail">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="email">Email de contact</label>
            <div class="fr-hint-text" id="email-help">
              Exemple : exemple@beta.gouv.fr
            </div>
            <input class="fr-input midlength-input" value="<%= psy[0].email %>"
            type="text"
            pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
            placeholder="exemple@beta.gouv.fr"
            id="email" name="email">
        </div>

        <div class="fr-my-3w">
          <label class="fr-label" for="address" aria-describedby="address-help">Adresse du cabinet</label>
          <input class="fr-input midlength-input" value="<%= psy[0].address %>"  type="text" id="address" name="address">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="departement" aria-describedby="departement-help">Votre département</label>
            <input class="fr-input midlength-input" value="<%= psy[0].departement %>"  type="text" id="departement" name="departement">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="region" aria-describedby="region-help">Votre région</label>
            <input class="fr-input midlength-input" value="<%= psy[0].region %>"  type="text" id="region" name="region">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="phone" aria-describedby="phone-help">Téléphone du secrétariat</label>
            <input class="fr-input midlength-input" value="<%= psy[0].phone %>"  type="text" id="phone" name="phone">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="website" aria-describedby="website-help">Site web professionnel</label>
            <input class="fr-input midlength-input" value="<%= psy[0].website %>"  type="text" id="website" name="website">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="description" aria-describedby="description-help">Paragraphe de présentation</label>
            <input class="fr-input midlength-input" value="<%= psy[0].description %>"  type="text" id="description" name="description">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="languages" aria-describedby="languages-help">Langues parlées</label>
            <input class="fr-input midlength-input" value="<%= psy[0].languages %>"  type="text" id="languages" name="languages">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="training" aria-describedby="training-help">Formations et expériences</label>
            <% training = psy[0].training %>
            <% training.forEach(function(elem){ %>
              <input class="fr-input midlength-input" value="<%= elem %>"  type="text" id="training" name="training">
            <% }) %>
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="diploma" aria-describedby="diploma-help">Diplomes</label>
            <input class="fr-input midlength-input" value="<%= psy[0].diploma %>"  type="text" id="diploma" name="diploma">
        </div>

        <div class="fr-my-3w">
            <label class="fr-label" for="university" aria-describedby="university-help">Université</label>
            <input class="fr-input midlength-input" value="<%= psy[0].university %>"  type="text" id="university" name="university">
        </div>*/}
        
      </div> 
      <div class="fr-my-5w">
        <button type="submit" class="fr-btn fr-btn--icon-left fr-fi-check-line">Valider les modifications</button>
      </div>
    </form>
      </div>
      <Mail />
    </div>
  );
};

export default EditProfile;
