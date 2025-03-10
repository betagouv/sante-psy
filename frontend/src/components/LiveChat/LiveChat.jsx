/* global $crisp */
import React, { useState } from 'react';
import { useStore } from 'stores/';
import { Button } from '@dataesr/react-dsfr';
import styles from './liveChat.cssmodule.scss';

const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [displayIcon, setDisplayIcon] = useState(true);
  const { commonStore: { config }, userStore: { user } } = useStore();

  const openChat = () => {
    loadCrisp().then(() => {
      if (window.$crisp) {
        $crisp.push(['do', 'chat:open']);
        setOpen(true);
        if (user && user.email) {
          $crisp.push(['set', 'user:email', user.email]);
          $crisp.push(['set', 'session:event', [[['psychologist-scenario']]]]);
          $crisp.push(['set', 'session:segments', [['chat', 'psychologist']]]);
        }
      }
    });
  };

  const hideChat = () => {
    setOpen(false);
    setDisplayIcon(false);
    if (window.$crisp) {
      $crisp.push(['do', 'chat:hide']);
    }
  };

  const loadCrisp = () => new Promise(resolve => {
    if (window.$crisp) {
      resolve();
    } else {
      window.CRISP_WEBSITE_ID = config.crispWebsite;
      window.$crisp = [];
      window.CRISP_READY_TRIGGER = () => resolve();
      const crispScript = document.createElement('script');
      crispScript.src = 'https://client.crisp.chat/l.js';
      document.getElementsByTagName('head')[0].appendChild(crispScript);
    }
  });

  return (
    !open
    && displayIcon && (
      <>
        <Button className={styles.closeButton} onClick={hideChat} icon="fr-icon-close-line" tertiary hasBorder={false} />
        <Button className={styles.chatButton} onClick={openChat}>
          <img className={styles.chatIcon} src="/images/icons/crisp_closed_chat.svg" alt="Chat icon" />
        </Button>
      </>
    )
  );
};

export default LiveChat;
