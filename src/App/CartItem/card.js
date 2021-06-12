import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RImg from 'react-image';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import InfoCard from './infoCard';
import EditCard from './editCard';
import SummaryCard from './summaryCard';
import TrashButton from './trashButton';
import { db } from '../../Firebase';
import { image } from './styles';
import Empty from './Empty';

export default ({ productId, cartProduct, update, exclude, setPrice, hideAllButtons }) => {
  const [isEditing, setEditing] = useState(false);
  const [product, setProduct] = useState({});
  const [fetchingProduct, setFecthingProduct] = useState(true);

  useEffect(() => {
    setFecthingProduct(true);
    return db
      .collection('catalog-images')
      .doc(productId)
      .onSnapshot(snap => {
        const data = snap.data();
        setProduct(data);
        //console.log('data inside card',data)
        setPrice(data?.price);
        setFecthingProduct(false);
      });
  }, [productId]);

  if (fetchingProduct) return <SpinnerWithDiv />;

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        style={{ position: 'relative' }}
        key="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        positionTransition={{ type: 'tween' }}
      >
        {product ? (<RImg
          style={image(!!cartProduct.status)}
          src={product.url}
          key={productId}
          container={children => {
            if (cartProduct.requestedQuantities && !isEditing)
              return (
                <>
                  {!hideAllButtons && <TrashButton onClick={exclude} />}
                  <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SummaryCard image={children} product={{ ...cartProduct, ...product }} setEditing={setEditing} hideAllButtons={hideAllButtons} />
                  </motion.div>
                </>
              );
            if ((!cartProduct.status && product.status === 'available') || isEditing)
              return (
                <>
                  {!hideAllButtons && <TrashButton onClick={exclude} />}
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <EditCard image={children} product={{ ...cartProduct, ...product }} update={update} setEditing={setEditing} />
                  </motion.div>
                </>
              );
            return (
              <>
                {!hideAllButtons && <TrashButton onClick={exclude} />}
                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <InfoCard image={children} product={{ ...cartProduct, ...product }} />
                </motion.div>
              </>
            );
          }}
          loaderContainer={() => <SpinnerWithDiv />}
        />): <Empty />}

      </motion.div>
    </AnimatePresence>
  );
};
