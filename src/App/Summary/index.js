import React, { useMemo } from 'react';
import { useHeader, useFooter, useAnimatedLocation } from '@bit/vitorbarbosa19.ziro.flow-manager';
import Summary from '@bit/vitorbarbosa19.ziro.summary';
import currencyFormat from '@ziro/currency-format';
import BottomFlowButtons from '@bit/vitorbarbosa19.ziro.bottom-flow-buttons';
import Header from '../Header';
import { useUserData } from '../useInfo';

export default ({ id }) => {
  const [{ cart, cpf, nascimento }] = useUserData();

  const item = useMemo(() => cart[id] || {}, [cart, id]);
  const [, setLocation] = useAnimatedLocation();

  useHeader(<Header title={item.brandName} backPath="/carrinho" />, [item]);
  // useFooter(
  //   <BottomFlowButtons
  //     next={() =>
  //       setLocation(
  //         'goLeft',
  //         cpf && cpf !== '' && nascimento && nascimento !== '' ? `/pagamento/${id}/escolher-cartao` : `/pagamento/${id}/informacoes-adicionais`,
  //       )
  //     }
  //   />,
  // );

  if (!item.brandName) return null;

  return (
    <div style={{ padding: '10px' }}>
      <Summary charge={currencyFormat(item.total)} installmentsMax="6" cartItem={item} />
    </div>
  );
};
