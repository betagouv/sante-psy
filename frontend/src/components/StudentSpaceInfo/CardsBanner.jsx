import React from 'react';
import { observer } from 'mobx-react';

import Slice from 'components/Slice/Slice';
import styles from './studentSpaceInfo.cssmodule.scss';
import Card from 'components/Card/Card';

const CardsBanner = () => {
  return (
    <div>
      <Slice
        customStyle={{
          content: styles.sliceContentNormal,
        }}
        title={(
          <>
            À quoi sert ton
            {' '}
            <b>Espace Étudiant</b>
            {' '}
            ?
          </>
        )}
      />
      <div className={styles.cardsWrapper}>
        <div className={styles.cardsContainer}>
          <Card
            customStyles={{ card: "customCard"}}
            image='studentSpace/suivi-gestion-seances.png'
            title='Suivre et gérer tes séances'
            description={(
              <ul className={styles.cardList}>
                <li>Retrouver l'historique de tes séances</li>
                <li>Accéder plus simplement à la prise de rendez-vous avec un psychologue</li>
                <li>Avoir une vision claire de ton parcours</li>
              </ul>
            )}
          />
          <Card
            customStyles={{ card: "customCard"}}
            image='studentSpace/mieux-t-orienter.png'
            title="Mieux t'orienter"
            description={(
              <ul className={styles.cardList}>
                <li>Retrouver facilement les dispositifs qui existent</li>
                <li>Comprendre à qui t’adresser selon ta situation</li>
                <li>Ne pas rester seul face à tes questions</li>
              </ul>
            )}
            hint='En construction'
          />
          <Card
            customStyles={{ card: "customCard"}}
            image='studentSpace/acces-contenu.png'
            title='Accéder à des contenus'
            description={(
              <ul className={styles.cardList}>
                <li>Ressources fiables et personnalisées, adaptées à ce que tu traverses</li>
                <li>Contenus pour mieux comprendre ta santé mentale</li>
              </ul>
            )}
            hint='En construction'
          />
          <Card
            customStyles={{ card: "customCard"}}
            image='studentSpace/journal-humeur.png'
            title="Tenir un journal d'humeur"
            description={(
              <ul className={styles.cardList}>
                <li>Noter comment tu te sens</li>
                <li>Mettre des mots sur ton ressenti</li>
                <li>Observer ce qui évolue dans le temps</li>
              </ul>
            )}
            hint='En construction'
          />
        </div>
      </div>
    </div>
  );
};

export default observer(CardsBanner);