import React from 'react';
import currencyFormat from '@ziro/currency-format';
import { infoCard, infoCardInfo, infoCardLabel, summaryBlock, priceLabel, summaryCardInfo } from './styles';

const PTstatus = {
  unavailable: 'Indisponível',
  waitingInfo: 'Aguardando variações e preços',
  waitingStock: 'Aguardando variações',
  soldOut: 'Esgotado',
};

export default ({ image, product }) => {
  return (
    <div style={infoCard}>
      {image}
      <div style={infoCardInfo(product.status === 'waitingStock')}>
        {product.status === 'waitingStock' && (
          <div style={summaryBlock}>
            <label style={priceLabel}>Preço</label>
            <label>{currencyFormat(product.price)}</label>
          </div>
        )}
        <label style={{ ...infoCardLabel }}>{PTstatus[product.status || 'waitingInfo']}</label>
      </div>
    </div>
  );
};
