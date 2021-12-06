import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'stores/';

const Logout = () => {
  const navigate = useNavigate();
  const { userStore: { deleteToken } } = useStore();

  useEffect(() => {
    deleteToken();
    navigate('/');
  });

  return null;
};

export default Logout;
