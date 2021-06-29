import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import {
  Header as DSHeader,
  HeaderBody,
  Logo,
  Service,
  Tool,
  ToolItemGroup,
  ToolItem,
  Button,
} from '@dataesr/react-dsfr';
import { useStore } from 'stores/';
import Nav from './Nav';

const Header = () => {
  const location = useLocation();
  const { userStore: { user, setToken } } = useStore();
  const [path, setPath] = useState(() => location.pathname || '');

  useEffect(() => {
    if (path !== location.pathname) {
      setPath(location.pathname);
    }
  }, [path, setPath, location]);

  const psychologistPage = location.pathname.startsWith('/psychologue');
  return (
    <>
      <DSHeader>
        <HeaderBody>
          <Logo>
            Ministère de l&lsquo;Enseignement Supérieur, de la Recherche et de l&lsquo;Innovation
          </Logo>
          <Service
            title={`${__APPNAME__}${psychologistPage ? ' - Espace Psychologues' : ''}`}
            description="Accompagnement psychologique pour les étudiants"
          />
          <Tool>
            <ToolItemGroup>
              {user ? (
                <ToolItem link="/" onClick={() => { setToken(null); }}>
                  Déconnexion
                </ToolItem>
              ) : (
                <ToolItem link="/psychologue/login">
                  <Button>Se connecter en tant que psychologue</Button>
                </ToolItem>
              )}
            </ToolItemGroup>
          </Tool>
        </HeaderBody>
        <Nav path={location.pathname} connected={psychologistPage && user} />
      </DSHeader>
    </>
  );
};

export default observer(Header);
