import React, { useEffect } from 'react';
import { useHeader, usePersistentScroll, useHideOnScroll, useAnimatedLocation } from '@bit/vitorbarbosa19.ziro.flow-manager';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Header from '../Header';
import { useCart, useUserData } from '../useInfo';
import { container, statusBlock, statusName, card, dot, bubble } from './styles';

const PTStatus = {
  open: 'Em aberto',
  waitingConfirmation: 'Aguardando confirmação',
  waitingPayment: 'Aguardando pagamento',
};

export default () => {
  const [{ uid }] = useUserData();
  useHeader(<Header title="Carrinho" soloTitle />);
  useHideOnScroll();
  usePersistentScroll();

  const [, setLocation] = useLocation();
  const [, setAnimatedLocation] = useAnimatedLocation();

  useEffect(() => {
    !uid && setLocation('/login');
  }, []);

  const { cartByStatus } = useCart();

  if (!cartByStatus) return null;

  return (
    <div style={container}>
      {Object.keys(cartByStatus).length ? (
        Object.entries(cartByStatus).map(([status, item]) => (
          <div key={status} style={statusBlock}>
            <label style={statusName}>{PTStatus[status] || 'Desconhecido'}</label>
            {item.map(({ brandName, products, id }) => (
              <motion.div key={id} whileTap={{ scale: 0.95 }} style={card} onClick={() => setAnimatedLocation('goLeft', `/carrinho/${id}`)}>
                <label>
                  {brandName}
                  <span style={dot}>.</span>
                </label>
                <div style={bubble}>{Object.keys(products).length}</div>
                <div style={{ transform: 'rotate(90deg)' }}>
                  <Icon type="chevronUp" size={20} color="black" />
                </div>
              </motion.div>
            ))}
          </div>
        ))
      ) : (
        <div
          style={{
            display: 'grid',
            maxWidth: '350px',
            margin: '0 auto',
            padding: '20px',
            gridGap: '20px',
            justifyItems: 'center',
          }}
        >
          <Illustration type="withoutCartItem" size={200} />
          <label style={{ textAlign: 'center', marginTop: '-20px' }}>Você ainda não adicionou peças no carrinho!</label>
        </div>
      )}
    </div>
  );
};
