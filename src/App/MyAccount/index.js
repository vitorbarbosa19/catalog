import React from 'react';
import { padding } from '@ziro/theme';
import { useHeader, usePersistentScroll } from '@bit/vitorbarbosa19.ziro.flow-manager';
import { Link } from 'wouter';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { container, option, optionWhite, dot } from './styles';
import Header from '../Header';

const MyAccount = () => {
  useHeader(<Header title="Minha conta" backPath="/menu" />);
  usePersistentScroll();
  return (
    <div style={{ ...container, padding }}>
      <Link href="/meus-dados/fisica">
        <label style={option}>
          Meus dados&nbsp;&nbsp;
          <Icon type="user" size={14} strokeWidth={3} color="white" />
          <span style={dot}>.</span>
        </label>
      </Link>
      <Link href="/trocar-senha">
        <label style={option}>
          Trocar senha&nbsp;&nbsp;
          <Icon type="lock" size={14} strokeWidth={3} color="white" />
          <span style={dot}>.</span>
        </label>
      </Link>

      <Link href="/trocar-email">
        <label style={option}>
          Trocar email&nbsp;&nbsp;
          <Icon type="email" size={14} strokeWidth={3} color="white" />
          <span style={dot}>.</span>
        </label>
      </Link>
      <Link href="/deletar-conta">
        <label style={optionWhite}>
          Deletar conta&nbsp;
          <Icon type="close" size={14} strokeWidth={3} color="#222" />
          <span style={dot}>.</span>
        </label>
      </Link>
    </div>
  );
};

export default MyAccount;
