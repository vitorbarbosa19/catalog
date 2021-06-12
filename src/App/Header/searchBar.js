import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { grayColor1 } from '@ziro/theme';
import { useCache } from '@bit/vitorbarbosa19.ziro.flow-manager';
import { searchBar } from './styles';

export default ({ onChange }) => {
  const [debounced] = useDebouncedCallback(onChange, 1000);
  const [_value, setValue] = useCache('', 'searchText');

  return (
    <div style={{ position: 'relative', display: 'grid' }}>
      <input
        id="debounceSearch"
        type="text"
        value={_value}
        onChange={({ target: { value } }) => {
          debounced(value);
          setValue(value);
        }}
        placeholder="Procurar marca..."
        style={searchBar}
      />
      <Icon type="search" size={15} color={grayColor1} style={{ position: 'absolute', top: '8px', right: '15px' }} />
    </div>
  );
};
