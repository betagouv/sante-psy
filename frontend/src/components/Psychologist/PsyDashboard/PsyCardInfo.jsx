import { Button } from "@dataesr/react-dsfr";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import string from "services/string";
import { useStore } from "stores/index";

import styles from './psyDashboard.cssmodule.scss';

// typer les props
const PsyCardInfo = ({ psychologist, onEditMode }) => {
  const {
    userStore: { user },
  } = useStore();

  return (
    <>
      <section className={styles.psyDashboardCard}>
        <div className={styles.psyDashboardCardFirstColumn}>
          <img src="/images/psychologist-profile.svg" alt="icon of a person in a circle" className={styles.psyPersonIcon} />
          <b>{psychologist.firstNames} {psychologist.lastName}</b>
          {psychologist.active && (
            <Button
              id="show-public-profile-button"
              data-test-id="show-public-profile-button"
              title="profil public"
              icon="fr-fi-eye-line"
              secondary
              onClick={() =>
                navigate(`/trouver-un-psychologue/${user.dossierNumber}`)
              }
            >
              Voir profil public
            </Button>
          )}
          <b>{"Université "}{user.convention.universityName}</b>
        </div>
        <div className={styles.psyDashboardCardSecondColumn}>          
          <p>
            {psychologist.address}
          </p>
          <p>
            {psychologist.email}{' '}{psychologist.phone}
          </p>
          <span className="">
            <Button
              secondary
              onClick={() => {
                window.open(string.prefixUrl(psychologist.website), "_blank");
              }}
              icon="ri-link"
            >
              Site web
            </Button>
            <Button
              secondary
              icon="ri-calendar-line"
              onClick={() => {
                window.open(
                  string.prefixUrl(psychologist.appointmentLink),
                  "_blank"
                );
              }}
            >
              Site de prise de RDV
            </Button>
          </span>
          <Button
            secondary
            id="show-profile-form-button"
            title="Modify"
            icon="ri-edit-line"
            onClick={() => onEditMode(true)}
          >
            Modifier
          </Button>
        </div>
      </section>
    </>
  );
};

export default PsyCardInfo;
