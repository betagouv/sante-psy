import React, { useState } from "react";
import { useStore } from 'stores/';
import styles from './liveChat.cssmodule.scss';
import { Button } from '@dataesr/react-dsfr';

export const LiveChat = () => {
  const [open, setOpen] = useState(false);
  const [displayIcon, setDisplayIcon] = useState(true);
  const { commonStore: { config }, userStore: { user } } = useStore();

  const openChat = () => {
    loadCrisp().then(() => {
        console.log('here');
        $crisp.push(['do', 'chat:open']);
        setOpen(true);
        if (user.email) {
            $crisp.push(["set", "user:email", user.email]);
            $crisp.push(["set", "session:event", [[["psychologist-scenario"]]]]);
            $crisp.push(["set", "session:segments", [["psychologist"]]]);
        }
    });
  };

  const hideChat = () => {
    console.log('there');
    setOpen(false);
    setDisplayIcon(false);
    $crisp.push(["do", "chat:hide"])
  };

  const loadCrisp = () => {
    return new Promise((resolve, reject) => {
        if (window.$crisp) {
            resolve(); // Crisp already loaded
        } else {
            window.CRISP_WEBSITE_ID = config.crispWebsite;
            window.$crisp = [];
            window.CRISP_READY_TRIGGER = () => resolve(); // Triggered when Crisp is ready
            const crispScript = document.createElement('script');
            crispScript.src = "https://client.crisp.chat/l.js";
            document.getElementsByTagName("head")[0].appendChild(crispScript);
        }
    });
  };

  return (
    !open &&
    displayIcon && (
      <>
        <Button className={styles.closeButton} onClick={hideChat} icon='fr-icon-close-line' tertiary={true} hasBorder={false}/>
        <Button className={styles.chatButton} onClick={openChat}>
          <img className={styles.chatIcon} src={'/images/crisp_closed_chat.svg'} alt="Chat icon" />
        </Button>
      </>
    )
  );
};

export default LiveChat;