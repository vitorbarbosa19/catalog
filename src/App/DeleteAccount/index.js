import React from 'react';
import DeleteAccount from '@bit/vitorbarbosa19.ziro.delete-account';
import sendToBackend from './sendToBackend';
import { useCards, useDeleteCard } from '../antifraudeOld';
import { useUserData, useCart, useFavorites } from '../useInfo';

export default () => {
  const { cards } = useCards();
  const deleteCard = useDeleteCard();
  const [{ buyerStoreownerId }] = useUserData();
  const { deleteBatchFromCart, cart } = useCart();
  const { favorites, unfavorite } = useFavorites();
  return (
    <DeleteAccount
      sendToBackend={sendToBackend({ cards, deleteCard, buyerStoreownerId, cart, deleteBatchFromCart, favorites, unfavorite })}
      navigateTo="/minha-conta"
    />
  );
};
