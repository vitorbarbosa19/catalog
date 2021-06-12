import React, { useMemo, useState, useCallback, useEffect } from 'react';
import queryString from 'query-string';
import { useRoute, useLocation } from 'wouter';
import capitalize from '@ziro/capitalize';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { useHeader, usePersistentScroll, useHideOnScroll, useFooter, useModal, useScroll, useHistory } from '@bit/vitorbarbosa19.ziro.flow-manager';
import RImg from 'react-image';
import { motion } from 'framer-motion';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import MenuHover from '@bit/vitorbarbosa19.ziro.menu-hover';
import Card from '@bit/vitorbarbosa19.ziro.card';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Footer from '@bit/vitorbarbosa19.ziro.footer';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import Header from '../Header';
import useFetch from './useFetch';
import Empty from '../Empty';
import PriceTable from './priceTable';
import { container, registerButton, modal, title, text, number, close } from './styles';
import { useBrands, useFavorites, useCart, useUserData } from '../useInfo';
import BottomTab from '../BottomTabBar';
import { useToast } from '../useUI';
import './howToBuy.css';
import { supportPhoneNumber } from "../utils";

export default () => {
  const { setMessageToast, setOpenToast } = useToast();
  const [{ uid }] = useUserData();
  const match = useRoute('/marcas/:name');
  const { name } = match[1] || {};
  const brand = name && capitalize(name.split('-').join(' '));
  const [modalHowToBuyOpen, setModalHowToBuyOpen] = useState(false);
  const [photosRender, setPhotosRender] = useState(null);
  const [render, setRender] = useState(0);
  const trend = useMemo(() => {
    const { trend: _trend } = queryString.parse(window.location.search);
    if (_trend) return _trend.replace(/-/g, ' ');
    return undefined;
  }, []);
  const [wLocation, setWLocation] = useLocation();
  useEffect(() => {
    wLocation === '/' && setWLocation(`marcas/${brand.replace(/\s/g, '-').toLowerCase()}`);
  }, []);
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
  const history = useHistory();
  const backPath = useMemo(() => {
    if (history[history.length - 2] && history[history.length - 2].pathname !== '/galeria') return history[history.length - 2].pathname;
    return trend ? `/galeria?trend=${trend.replace(/\s/g, '-').toLowerCase()}` : '/galeria';
  }, [history, trend]);

  const [brands] = useBrands();
  const { favoriteIds, onFavoritePress } = useFavorites();
  const { cartIds, onCartPress } = useCart();

  const brandInfo = useMemo(() => brands.find(({ brand: _brand }) => _brand === brand), [brands, brand]);

  useHeader(<Header title={brand} backPath={backPath} drawerMenu />, [backPath]);
  usePersistentScroll();

  const [isPriceTableOpen, setPriceTableOpen] = useState(false);
  const [isOld, setIsOld] = useState(false);

  const onClickPrice = useCallback(() => {
    if (brandInfo && brandInfo.price) setPriceTableOpen(true);
    else {
      setMessageToast('Preços não disponíveis para esta marca');
      setOpenToast(true);
    }
  });

  const onClickSoldOut = useCallback(() => {
    uid ? setMessageToast('O produto se encontra esgotado!') : setMessageToast('Cadastre-se para salvar peças e ver preços!');
    setOpenToast(true);
  });

  useFooter(<BottomTab />, [isPriceTableOpen, brandInfo]);

  useModal(
    brandInfo && brandInfo.price ? (
      <PriceTable isPriceTableOpen={isPriceTableOpen} setPriceTableOpen={setPriceTableOpen} brand={brand} price={brandInfo.price} uid={uid} />
    ) : null,
    [isPriceTableOpen, brandInfo],
  );
  useScroll(!isPriceTableOpen);

  const { photos, setPhotos, fetching, sizeSnap, empty } = useFetch(brand, isOld, brandInfo, setRender);
  useEffect(() => {
    if (photos.length > 0 && !!brandInfo && render < 5) {
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
      setRender(render + 1);
    }
    setPhotosRender(null);
  }, [photos, brandInfo, render]);
  if (fetching && empty) return <SpinnerWithDiv />;
  if (empty) return <Empty />;
  return (
    <>
      <div style={container} id="list">
        {photos.map(({ brandName, url, productId, timeInDays, cartQuantity, favQuantity, status }, index) => {
          console.log('brandName, productId, status',brandName, productId, status)
          return (
          <Card
            isAddedToCart={cartIds.includes(productId)}
            isFavorited={favoriteIds.includes(productId)}
            onFavoritePress={() => onFavoritePress(productId, status)}
            onCartPress={() => onCartPress(brandName, productId, status)}
            showBrandName
            photo={photos[index]}
            uid={uid}
            wLocation={wLocation}
            setWLocation={setWLocation}
            test={false}
            onClickSoldOut={onClickSoldOut}
            key={url}
            setModalHowToBuyOpen={setModalHowToBuyOpen}
            selectedCard={2}
          />
        )})}
      </div>
      {fetching && sizeSnap === 20 ? <SpinnerWithDiv /> : <div />}
    </>
  );
};
