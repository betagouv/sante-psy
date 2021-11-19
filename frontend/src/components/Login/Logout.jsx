import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from 'stores/';

const Logout = () => {
  const history = useHistory();
  const { userStore: { deleteToken } } = useStore();

  useEffect(() => {
    deleteToken();
    history.push('/');
  });

  return null;
};

export default Logout;
