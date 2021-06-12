import { fontTitle, gradient, grayColor1, fontSizeInput, shadow, fontSizeNormal } from '@ziro/theme';

export const container = {
    display: 'grid',
    gridGap: '20px',
    maxWidth: window.innerWidth > 500 ? '385px' : window.innerWidth - 15,
    margin: '0 auto',
  },
  card = {
    borderRadius: '3px',
    textAlign: 'center',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 0px 12px -3px',
    background: 'white',
  },
  cardInfo = {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    gridGap: '20px',
    alignItems: 'center',
    justifyItems: 'center',
    padding: '10px 20px',
  },
  priceButton = {
    display: 'grid',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    MozAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '100px',
    padding: '6px 0px',
    border: 'none',
    borderRadius: '20px',
    fontFamily: fontTitle,
    fontSize: '1.1rem',
    color: '#FFF',
    textAlign: 'center',
    background: gradient,
    boxShadow: `0px 3px 8px -3px rgba(34,34,34,0.65)`,
  },
  registerButton = {
    ...priceButton,
    margin: '0 auto -10px',
    maxWidth: '150px',
    fontSize: '1.3rem'
  },
  image = {
    objectFit: 'contain',
    width: '100%',
  },
  bottomTabContainer = {
    height: '60px',
    background: gradient,
    display: 'grid',
    gridTemplateColumns: '20px 1fr',
    gridGap: '20px',
    padding: '0px 20px',
    alignItems: 'center',
  },
  bottomTabLabel = {
    fontFamily: fontTitle,
    color: 'white',
    textAlign: 'center',
    marginLeft: '-40px',
  },
  modalContainer = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    maxWidth: '500px',
    margin: 'auto',
  },
  tableContainer = {
    display: 'grid',
    padding: '20px',
    gridGap: '10px',
    overflow: 'auto',
    height: window.innerHeight - 80,
    boxSizing: 'border-box',
  },
  info = {
    padding: '10px 20px 20px',
  },
  cart = {
    margin: '0px',
    padding: '10px 0px 10px',
  },
  timestampStyle = {
    textAlign: 'right',
    color: grayColor1,
    fontSize: '12px',
  },
  registerHere = {
    display: 'grid',
    maxWidth: '350px',
    margin: '10px auto',
    padding: '20px',
    gridGap: '20px',
    justifyItems: 'center',
  },
  modal = {
    zIndex: '999',
    display: 'grid',
    gridRowGap: '10px',
    maxWidth: '400px',
    width: '90%',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
    borderRadius: '3px',
    textAlign: 'start',
    background: 'white',
    boxShadow: `1px 0px 8px 0px rgba(34,34,34,0.15), 1px 0px 8px 0px rgba(34,34,34,0.10),
    1px 0px 8px 0px rgba(34,34,34,0.05)`
  },
  title = {
    fontFamily: fontTitle,
    fontSize: '1.5rem',
    textAlign: 'center',
    textTransform: 'uppercase'    
  },
  text = {
    fontSize: '1.4rem'
  },
  number = {
    fontFamily: fontTitle,
    fontSize: '1.5rem'
  },
  close = {
    marginBottom: '-20px',
    fontFamily: fontTitle,
    textAlign: 'end'
  }
