import React from 'react';
import BottomTab from '@bit/vitorbarbosa19.ziro.bottom-tab-bar';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { primaryColor, grayColor2 } from '@ziro/theme';
import { useUserData } from '../useInfo';

const BottomTabBar = () => {
  const [{ favorites, cart, uid }] = useUserData();
  const cartItems = cart && Object.values(cart).filter(item => item.status !== 'paid').length
  const toggleColor = uid ? primaryColor : grayColor2;
  return (
    <BottomTab
      buttons={[
        {
          location: '/galeria',
          secondaryLocations: ['/marcas'],
          icon: isSelected => <Icon type="search" size={20} strokeWidth={isSelected ? 3 : 1} />,
        },
        {
          location: '/favoritos',
          onClick: uid ? null : () => null, // prevents user from clicking
          icon: isSelected => <Icon type="heart" size={20} strokeWidth={1} color={toggleColor} fill={uid ? isSelected : false} />,
          notificationNumber: Object.keys(favorites).length,
        },
        {
          location: '/carrinho',
          onClick: uid ? null : () => null, // prevents user from clicking
          icon: isSelected => <Icon type="cart" size={20} strokeWidth={1} color={toggleColor} fill={uid ? isSelected : false} />,
          notificationNumber: cartItems,
        },
        {
          location: '/menu',
          secondaryLocations: [
            '/minha-conta',
            '/meus-dados',
            '/trocar-email',
            '/trocar-senha',
            '/deletar-conta',
            '/login',
            '/menu',
            '/problemas-acesso',
            '/reenviar-email',
            '/resetar-senha',
            '/pagamentos',
            '/pagamento',
            '/comprovante',
          ],
          icon: isSelected => <Icon type="user" size={20} strokeWidth={1} fill={isSelected} />,
        },
      ]}
    />
  );
};

export default BottomTabBar;
