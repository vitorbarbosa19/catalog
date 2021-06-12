import React, { useMemo, useCallback, useState, useEffect, useContext } from 'react';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { AnimatePresence, motion } from 'framer-motion';
import { useHeader, usePersistentScroll, useHideOnScroll, useAnimatedLocation, useCache } from '@bit/vitorbarbosa19.ziro.flow-manager';
import Header from '../Header';
import Empty from '../Empty';
import { image, label } from './styles';
import Filter from '../Filter';
import { useBrands, useUserData } from '../useInfo';

export default () => {
  const [{ uid }] = useUserData();
  const [search, setSearch] = useCache('', 'searchTextAll');
  const [filter, setFilter] = useState(false);
  const [trend, _setTrend] = useCache(undefined, 'trend');
  const setTrend = useCallback(_trend => {
    _setTrend(_trend);
    setFilter(false);
  });

  useHeader(<Header title={filter ? 'Tendências' : null} onSearch={filter ? null : setSearch} toggleFilter={setFilter} trend={trend} />, [
    filter,
    trend,
  ]);
  usePersistentScroll();
  useHideOnScroll();

  const [_, setLocation] = useAnimatedLocation();

  const [_brands, isQuering, error] = useBrands();

  const brands = useMemo(() => {
    const trendResult = trend ? _brands.filter(({ trends }) => trends.includes(trend)) : _brands;
    const searchResult = search ? trendResult.filter(({ brand }) => new RegExp(`\\b${search}`, 'gi').test(brand)) : trendResult;
    return searchResult;
  }, [_brands.length, trend, search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [search, trend]);

  return (
    <AnimatePresence exitBeforeEnter>
      {filter && (
        <motion.div
          key="filter"
          initial={{ y: '-10%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-10%', opacity: 0 }}
          transition={{ type: 'tween' }}
        >
          <Filter trend={trend} setTrend={setTrend} />
        </motion.div>
      )}
      {!filter && (
        <motion.div
          key="brands"
          style={{
            display: 'grid',
            gridTemplateColumns: !brands.length ? '1fr' : '1fr 1fr',
            gridGap: '4px',
          }}
          initial={{ y: '10%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '10%', opacity: 0 }}
          transition={{ type: 'tween' }}
        >
          {(() => {
            if (isQuering && !brands.length) return <SpinnerWithDiv />;
            if (!isQuering && !brands.length) return <Empty />;
            return brands.map(({ brand, updatedThumb, updatedLoggedThumb }) => (
              <div
                key={brand}
                onClick={() => setLocation('goLeft', `marcas/${brand.replace(/\s/g, '-').toLowerCase()}`)}
                style={image(window.innerWidth, uid ? updatedLoggedThumb || updatedThumb : updatedThumb)}
              >
                <label style={label(window.innerWidth)}>{brand}</label>
              </div>
            ));
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
