import React, { useEffect, useState } from 'react';
import { useAnimation, motion, AnimatePresence } from 'framer-motion';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { useAnimatedLocation } from '@bit/vitorbarbosa19.ziro.flow-manager';
import Button from '@bit/vitorbarbosa19.ziro.button';
// import currencyFormat from '@ziro/currency-format'
import { bottomTabContainer, bottomTabLabel, modalContainer, tableContainer, registerHere } from './styles';
import prices from './prices';

export const BottomTab = ({ isPriceTableOpen, setPriceTableOpen, brand, uid, price }) => (
  <div style={bottomTabContainer} onClick={() => setPriceTableOpen(old => !old)}>
    <motion.div animate={{ rotate: isPriceTableOpen ? '180deg' : '0deg' }} style={{ originX: 0.5, originY: 0.5, height: 20, width: 20 }}>
      <Icon type="chevronUp" size={20} color="white" />
    </motion.div>
    <label style={bottomTabLabel}>{isPriceTableOpen ? brand : 'Tabela de preços'}</label>
  </div>
);

export default ({ isPriceTableOpen, setPriceTableOpen, brand, price, uid, featured }) => {
  const [_, setLocation] = useAnimatedLocation();
  const [shouldGoToRegister, setShouldGoToRegister] = useState(false);
  return (
    <AnimatePresence>
      {isPriceTableOpen && (
        <motion.div
          style={modalContainer}
          initial={{ y: window.innerHeight }}
          animate={{ y: 0 }}
          exit={{ y: window.innerHeight }}
          transition={{ type: 'spring', damping: 150, stiffness: 500 }}
          onAnimationComplete={() => {
            shouldGoToRegister && setLocation('goLeft', '/cadastrar');
          }}
        >
          <div style={{ maxWidth: 400, margin: 'auto' }}>
            <BottomTab isPriceTableOpen={isPriceTableOpen} setPriceTableOpen={setPriceTableOpen} brand={brand} uid={uid} />
            {uid && price ? (
              <div style={tableContainer}>
                {Object.entries(prices[price]).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      justifyContent: 'space-between',
                    }}
                  >
                    <label>{key}</label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: value[0] && value[1] ? '1fr auto 1fr' : 'auto 1fr',
                        alignItems: 'center',
                      }}
                    >
                      {value[0] && !value[1] && <label style={{ fontSize: 11 }}>a partir de </label>}
                      {value[1] && !value[0] && <label style={{ fontSize: 11 }}>até </label>}
                      {value[0] && <label style={{ textAlign: 'center' }}>{value[0]}</label>}
                      {value[0] && value[1] && <label style={{ fontSize: 11 }}> a </label>}
                      {value[1] && <label style={{ textAlign: 'center' }}>{value[1]}</label>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={registerHere}>
                <Illustration type="buy" size={250} />
                <div style={{ textAlign: 'center' }}>
                  <label style={{ marginTop: '-20px' }}>
                    Use seu <b>CNPJ de vestuário</b> para ver preços, variações e comprar online
                  </label>
                </div>
                <Button
                  type="button"
                  cta="Cadastrar"
                  click={() => {
                    setShouldGoToRegister(true);
                    setPriceTableOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
