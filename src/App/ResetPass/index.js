import React from 'react';
import { useLocation } from 'wouter';
import ResetPass from '@bit/vitorbarbosa19.ziro.reset-pass';
import { useHistory } from '@bit/vitorbarbosa19.ziro.flow-manager';
import sendToBackend from './sendToBackend';

export default ({ isLogged }) => {
  const [, setLocation] = useLocation();
  const history = useHistory();
  if (isLogged) setLocation('/galeria');
  return <ResetPass sendToBackend={sendToBackend} navigateTo="/problemas-acesso" history={history} />;
};
