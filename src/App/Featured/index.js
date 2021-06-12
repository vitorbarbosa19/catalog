import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  useModal,
  useAnimatedLocation,
  useHeader,
  useHideOnScroll,
  usePersistentScroll,
  useScrollPagination,
} from '@bit/vitorbarbosa19.ziro.flow-manager';
import { motion } from 'framer-motion';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import RImg from 'react-image';
import { useLocation } from 'wouter';
import Card from '@bit/vitorbarbosa19.ziro.card';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Footer from '@bit/vitorbarbosa19.ziro.footer';
import Header from '../Header';
import useFetch from './useFetch';
import Empty from '../Empty';
import {
  brand,
  card,
  cardBottom,
  container,
  icons,
  priceButton,
  registerButton,
  image,
  info,
  timestampStyle,
  modal,
  title,
  text,
  number,
  close
} from './styles';
import { useBrands, useCart, useFavorites, useUserData } from '../useInfo';
import { useToast } from '../useUI';
import { cart } from '../GalleryBrand/styles';
import { supportPhoneNumber } from "../utils";

export default () => {
  useHeader(<Header title="Novidades" />);
  const [{ uid }] = useUserData();
  const { setMessageToast, setOpenToast } = useToast();
  useHideOnScroll();
  usePersistentScroll();
  const [wLocation, setWLocation] = useLocation();
  const { onFavoritePress, favoriteIds } = useFavorites();
  const { cartIds, onCartPress } = useCart();

  const [, setLocation] = useAnimatedLocation();
  const initialCount = () => Number(window.localStorage.getItem('sliceMax')) || 20;
  const [sliceMax, setSliceMax] = useState(initialCount);
  const [renderNumber, setRenderNumber] = useState(0);
  const [shuffled, setShuffled] = useState(true);
  const [endPageAfterNavigation, setEndPageAfterNavigation] = useState(false);

  const [modalHowToBuyOpen, setModalHowToBuyOpen] = useState(false);

  useModal(
      <Modal boxStyle={modal} isOpen={modalHowToBuyOpen} setIsOpen={() => setModalHowToBuyOpen(false)}>
          <label style={close} onClick={() => setModalHowToBuyOpen(false)}>
              X
          </label>
          <label style={title}>Como comprar?</label>
          <label style={text}>
              <span style={number}>1)</span> Aperte o ícone de carrinho na foto para adicionar uma peça.
          </label>
          <label style={text}>
              <span style={number}>2)</span> Acesse seu carrinho via menu na barra inferior.
          </label>
          <label style={text}>
              <span style={number}>3)</span> No carrinho, aperte em 'Solicitar variações e preços'.
          </label>
          <label style={text}>
              <span style={number}>4)</span> Aguarde as informações de tamanhos, cores e preço para as peças escolhidas.
          </label>
          <label style={text}>
              <span style={number}>5)</span> Após atingir o mínimo de peças, aperte em 'Fechar pedido'.
          </label>
          <label style={text}>
              <span style={number}>6)</span> Pronto! Iremos confirmar a separação das peças na marca.
          </label>
          {uid ? null : <Button type="link" cta="Cadastre-se" navigate={() => setWLocation("/cadastrar")} style={registerButton} />}
          <Footer phone={supportPhoneNumber} />
      </Modal>,
      [modalHowToBuyOpen],
  );
  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  const onClickSoldOut = useCallback(() => {
    uid ? setMessageToast('O produto se encontra esgotado!') : setMessageToast('Cadastre-se para salvar peças e ver preços!');
    setOpenToast(true);
  });
  const [brands] = useBrands();
  const { photos, setPhotos, setShouldKeepFecthing, shouldFetchMore, isQuering, empty } = useFetch(brands);
  useEffect(() => {
    // console.log('photos', photos);
    // console.log('brandInfo', brandInfo);
    if (photos.length > 349 && !!brands && !shuffled) {
      setPhotos(
        photos.map(photo => {
          const infoAboutBrand = brands.find(({ brand: _brand }) => _brand === photo.brandName);
          let freeShipping = null;
          let minimumItemQty = null;
          if (infoAboutBrand) {
            freeShipping = infoAboutBrand.freeShipping;
            minimumItemQty = infoAboutBrand.minimumItemQty;
          }
          return {
            ...photo,
            freeShipping,
            minimumItemQty,
          };
        }),
      );
    }
  }, [photos, brands]);
  useEffect(() => {
    setShuffled(false);
    if (photos.length > 349 && !isQuering && !shuffled) {
      setPhotos(shuffle(photos));
    }
  }, [photos, isQuering]);
  window.onbeforeunload = e => {
    localStorage.clear();
  };

  const memoizedCallback = useCallback(() => {
    let firstRender = renderNumber;
    firstRender += 1;
    setRenderNumber(firstRender);
    // console.log(photos.length, renderNumber, shouldFetchMore);
    if (photos.length > 10 && renderNumber > 2 && shouldFetchMore) {
      window.localStorage.setItem('sliceMax', String(sliceMax + 20));
      setSliceMax(sliceMax + 20);
      setEndPageAfterNavigation(!endPageAfterNavigation);
    }
    if (photos.length > 10 && renderNumber === 1 && shouldFetchMore) {
      // console.log('entrou após navegação');
      window.localStorage.setItem('sliceMax', String(sliceMax + 20));
      setSliceMax(sliceMax + 20);
      setEndPageAfterNavigation(!endPageAfterNavigation);
    }
    if (sliceMax === 500) {
      // Colocar uma ilustração para o fim!
      /* console.log('entrou 500');
      setShouldKeepFecthing(true);
      window.localStorage.setItem('sliceMax', String(sliceMax + 20));
      setSliceMax(sliceMax + 20); */
    }
  }, [shouldFetchMore]);
  useMemo(memoizedCallback, [shouldFetchMore]);

  if (isQuering && !photos.length) {
    return (
      <div style={container}>
        <SpinnerWithDiv />
      </div>
    );
  }
  if (empty) return <Empty />;
  return (
    <>
      <div style={container} id="list">
        {photos.slice(0, sliceMax).map(({ brandName, url, productId, timeInDays, cartQuantity, favQuantity, status }, index) => (
          <Card
            onFavoritePress={() => onFavoritePress(productId, status)}
            onCartPress={() => onCartPress(brandName, productId, status)}
            isAddedToCart={cartIds.includes(productId)}
            isFavorited={favoriteIds.includes(productId)}
            photo={photos[index]}
            uid={uid}
            wLocation={wLocation}
            setWLocation={setWLocation}
            setLocation={setLocation}
            setModalHowToBuyOpen={setModalHowToBuyOpen}
            key={url}
          />
        ))}
      </div>
      {shouldFetchMore && isQuering && <SpinnerWithDiv />}
    </>
  );
};
