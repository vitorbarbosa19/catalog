import { useGlobalCache } from '@bit/vitorbarbosa19.ziro.flow-manager';
import { useContext } from 'react';
import { BRANDS, IS_QUERYING, QUERY_ERROR, USER_DATA, USER_ERROR } from './cacheKeys';

export const useBrands = () => {
    const [brands] = useGlobalCache([], BRANDS);
    const [isQuering] = useGlobalCache(false, IS_QUERYING);
    const [error] = useGlobalCache(undefined, QUERY_ERROR);

    return [brands, isQuering, error];
  },
  useUserData = () => {
    const [userData] = useGlobalCache({ favorites: {}, cart: {} }, USER_DATA);
    const [userError] = useGlobalCache(undefined, USER_ERROR);

    // console.log({ userData });

    return [userData, userError];
  };
