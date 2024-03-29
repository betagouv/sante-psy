/* global $crisp */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'stores/';

const Logout = () => {
  const navigate = useNavigate();
  const { userStore: { deleteToken } } = useStore();

  useEffect(() => {
    if (window.$crisp) {
      $crisp.push(['do', 'session:reset']);
    }
    deleteToken();
    navigate('/');
  });

  return null;
};

export default Logout;
