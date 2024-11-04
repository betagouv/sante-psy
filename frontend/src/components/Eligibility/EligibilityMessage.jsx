import React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import OtherServices from "components/OtherServices/OtherServices";

const EligibilityMessage = ({ isEligible }) => {
  return (
    <div>
      {isEligible ? (
        <p>
          Vous êtes éligible au dispositif Santé Psy Étudiant !<br />
          Prenez rendez-vous dès à présent avec un psychologue partenaire
          {" "}
          <Link to="/trouver-un-psychologue">
            via notre annuaire de psychologues.
          </Link>
          <br />
          Votre certificat de scolarité vous sera demandé lors de votre première
          consultation.
        </p>
      ) : (
        <p>
          Nous sommes désolé, vous n’êtes hélas pas éligible au dispositif Santé
          Psy Étudiant.
          <br />
          N’hésitez pas à vous rapprocher de votre service étudiant pour
          confirmer que vous n’avez ni un numéro INE ni une cotisation CVEC.
          <br />
          Auquel cas, retrouvez les différents services qui pourront vous
          accompagner.
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          <button>Retour à l'accueil</button>
        </Link>
        <button onClick={() => window.location.reload()}>
          Refaire le test
        </button>
      </div>
      {/* {isEligible ? (

      ) : (
        <OtherServices />
      )} */}
    </div>
  );
};

export default observer(EligibilityMessage);
