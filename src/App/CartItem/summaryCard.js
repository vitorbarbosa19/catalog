import React, { useMemo } from 'react';
import Button from '@bit/vitorbarbosa19.ziro.button';
import currencyFormat from '@ziro/currency-format';
import {
  summaryCardContainer,
  summaryCardInfo,
  summaryBlock,
  priceLabel,
  description,
  stock,
  stockGrid,
  stockLabel,
  stockQty,
  infoCardLabel,
  button,
} from './styles';

export default ({ image, product, setEditing, hideAllButtons }) => {
  return (
    <div style={summaryCardContainer}>
      {image}
      <div style={summaryCardInfo}>
        {product.description ? (
          <div style={summaryBlock}>
            <label style={priceLabel}>Descrição</label>
            <label style={description}>{product.description}</label>
          </div>
        ) : null}
        <div style={summaryBlock}>
          <label style={priceLabel}>Preço</label>
          <label>{currencyFormat(product.price)}</label>
        </div>
        <div>
          <label style={priceLabel}>Variações escolhidas</label>
          <div style={stock}>
            {Object.keys(product.requestedQuantities).length ? (
              Object.keys(product.requestedQuantities)
                .sort()
                .map(key => {
                  const qty = product.requestedQuantities[key];
                  if (parseInt(qty) < 1) return null;
                  return (
                    <div key={key} style={stockGrid}>
                      <label style={stockLabel}>{`${key}`}</label>
                      <label style={stockQty}>{qty}</label>
                    </div>
                  );
                })
            ) : (
              <div>
                <label style={infoCardLabel}>nenhuma variação</label>
              </div>
            )}
          </div>
        </div>
        {Object.keys(product.requestedQuantities).length ? (
          <div style={summaryBlock}>
            <label style={priceLabel}>Total a pagar</label>
            <label>
              {currencyFormat(
                Object.entries(product.requestedQuantities)
                  .map(([key, qty]) => product.price * qty)
                  .reduce((acc, curr) => acc + curr),
              )}
            </label>
          </div>
        ) : null}
        {!hideAllButtons && <Button style={button} type="button" cta="Editar" click={() => setEditing(true)} />}
      </div>
    </div>
  );
};
