import { primaryColor, alertColor, fontSizeSmall, fontWeightMuted } from '@ziro/theme'

export const

  container = {
    display: 'grid',
    gridRowGap: '5px',
    marginTop: '15px'
  },

  fetch = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    gridColumnGap: '2px',
    margin: '0 auto -40px',
    fontSize: '1.2rem',
    color: alertColor
  },

  update = {
    margin: '25px 0',
    textAlign: 'left',
    fontSize: fontSizeSmall,
    fontWeight: fontWeightMuted,
    color: primaryColor
  }
