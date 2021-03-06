import { fontTitle, primaryColor, alertColor, shadow } from '@ziro/theme';

export const toastStyle = {
    zIndex: '9999',
    maxWidth: '400px',
    display: 'block',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    MozAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    width: '90%',
    margin: '10px auto 0',
    padding: '20px 0px',
    border: 'none',
    borderRadius: '5px',
    fontFamily: fontTitle,
    color: alertColor,
    textAlign: 'center',
    background: 'white',
    boxShadow: `${shadow}`,
  },
  labelStyle = {
    display: 'grid',
    width: '90%',
    margin: '0 auto',
    textAlign: 'center',
    fontSize: '1.4rem'
};
