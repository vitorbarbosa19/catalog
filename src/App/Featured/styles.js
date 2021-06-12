import { grayColor1, fontTitle, fontSizeInput, gradient, shadow } from '@ziro/theme';

export const container = {
    display: 'grid',
    gridGap: '20px',
    alignContent: 'start',
    minHeight: '100vh',
    maxWidth: window.innerWidth > 500 ? '385px' : window.innerWidth - 15,
    margin: '0 auto',
  },
  card = {
    borderRadius: '3px',
    textAlign: 'center',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 0px 12px -3px',
    background: 'white',
  },
  image = {
    objectFit: 'contain',
    width: '100%',
  },
  brand = {},
  timestampStyle = {
    color: grayColor1,
    fontSize: '12px',
    justifySelf: 'end',
  },
  cardBottom = {
    display: 'grid',
    alignItems: 'center',
    gridRowGap: '6px',
    padding: '10px 10px 20px',
  },
  icons = {
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr',
    gridGap: '20px',
    alignItems: 'center',
    justifyItems: 'center'
  },
  priceButton = {
    justifySelf: 'end',
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
  info = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    justifyItems: 'start',
  },
  cart = {
    margin: '0px',
    padding: '10px 0px 10px',
  },
  likes = { textAlign: 'left' },
  toastStyle = {
    position: 'fixed',
    marginTop: '15px',
    zIndex: '9999',
    maxWidth: '500px',
    display: 'block',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    MozAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    padding: '10px 0px',
    border: 'none',
    borderRadius: '5px',
    fontFamily: fontTitle,
    color: '#FFF',
    textAlign: 'center',
    background: gradient,
    boxShadow: `${shadow}`,
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
