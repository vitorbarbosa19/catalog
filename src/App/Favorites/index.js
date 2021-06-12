import React, { useState, useContext, useEffect } from 'react';
import { useHeader, usePersistentScroll, useHideOnScroll, useAnimatedLocation, useModal } from '@bit/vitorbarbosa19.ziro.flow-manager';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import Header from '../Header';
import { container, card, button, cardHeader, brandName, trashButton, cardContent, thumb, excludeButton } from './styles';
import { useFavorites, useCart, useUserData } from '../useInfo';

export default () => {
  const [{ uid }] = useUserData();
  useHeader(<Header title="Favoritos" soloTitle />);
  useHideOnScroll();
  usePersistentScroll();

  const [, setLocation] = useLocation();
  const [, setAnimatedLocation] = useAnimatedLocation();

  useEffect(() => {
    !uid && setLocation('/login');
  }, []);

  const { favoritesByBrand, unfavorite } = useFavorites();
  const { addBatchToCart } = useCart();

  const [fullScreenIndex, setFullScreenIndex] = useState([-1, -1]);

  useModal(
    <AnimatePresence>
      {fullScreenIndex[0] !== -1 && fullScreenIndex[1] !== -1 && (
        <motion.div
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            display: 'grid',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'black',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFullScreenIndex([-1, -1])}
        >
          <img src={favoritesByBrand[fullScreenIndex[0]][fullScreenIndex[1]].url} style={{ width: '100%', objectFit: 'contain' }} />
        </motion.div>
      )}
    </AnimatePresence>,
    fullScreenIndex,
  );

  return (
    <div style={container}>
      {Object.keys(favoritesByBrand).length ? (
        Object.entries(favoritesByBrand).map(([brand, values]) => {
          return (
            <div key={brand} style={card}>
              <div style={cardHeader}>
                <label style={brandName} onClick={() => setAnimatedLocation('goLeft', `marcas/${brand.replace(/\s/g, '-').toLowerCase()}`)}>
                  {brand}
                </label>
                <motion.div
                  initial={false}
                  exit={{ opacity: 0 }}
                  style={trashButton}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => values.forEach(({ productId }) => unfavorite(productId))}
                >
                  <Icon type="trash" size={21} color="black" strokeWidth={1} />
                </motion.div>
              </div>
              <div style={cardContent}>
                {values.map(({ url, productId }, photoIndex) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 1] }}
                    key={url}
                    positionTransition={{ type: 'tween' }}
                    onClick={() => setFullScreenIndex([brand, photoIndex])}
                    style={thumb(url)}
                  >
                    <div
                      style={excludeButton}
                      onClick={event => {
                        unfavorite(productId);
                        event.stopPropagation();
                      }}
                    >
                      <Icon type="close" size={16} color="white" strokeWidth={3} />
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button
                type="button"
                cta={values.length > 0 ? 'Colocar no carrinho' : 'Adicione produtos!'}
                submitting={false}
                click={() =>
                  values.length > 0
                    ? addBatchToCart(
                        brand,
                        values.map(({ productId }) => productId),
                      )
                    : null
                }
                style={button}
              />
            </div>
          );
        })
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
          <Illustration type="withoutFavorites" size={200} />
          <label style={{ textAlign: 'center', marginTop: '-20px' }}>Você ainda não favoritou peças!</label>
        </div>
      )}
    </div>
  );
};
