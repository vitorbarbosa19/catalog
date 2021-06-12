import React from 'react';
import { useHeader, usePersistentScroll } from '@bit/vitorbarbosa19.ziro.flow-manager';
import Header from '../Header';
import Tabs from './Tabs/index';
import PersonData from './PersonData/index';
import BusinessData from './BusinessData/index';

const MyData = () => {
  useHeader(<Header title="Meus dados" backPath="/minha-conta" />);
  usePersistentScroll();

  return (
    <div
      id="tabDual"
      style={{
        maxWidth: '500px',
        height: '100vh',
        boxSizing: 'border-box',
        margin: '0 auto',
        padding: '20px 20px 60px',
      }}
    >
      <Tabs pathOne="/meus-dados/fisica" tabNameOne="p. física" pathTwo="/meus-dados/juridica" tabNameTwo="p. jurídica">
        <PersonData />
        <BusinessData />
      </Tabs>
    </div>
  );
};

export default MyData;
