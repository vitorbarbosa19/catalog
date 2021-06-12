import { primaryColor, fontTitle, secondaryColor, grayColor3 } from '@ziro/theme'

export const container = {
    display: 'grid',
    gridRowGap: '40px',
    marginTop: '30px',
    padding: '0 20px 60px'
  },
  statusBlock = {
      display: 'grid',
      gridRowGap: '15px'
  },
  statusName = {
      marginBottom: '-10px',
      padding: '0 10px',
      color: primaryColor,
      fontFamily: fontTitle,
      fontSize: '1.3rem',
      textTransform: 'uppercase'
  },
  card = {
    display: 'grid',
    padding: '12px 20px',
    background: 'white',
    borderRadius: '5px',
    boxShadow: 'rgba(34, 34, 34, 0.3) 0px 3px 8px -1px',
    gridTemplateColumns: '1fr auto auto',
    alignItems: 'center',
    color: primaryColor
  },
  dot = {
      fontSize: '21px',
      color: secondaryColor
  },
  cardHeader = {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 10px',
  },
  trashButton = {
    height: 40,
    width: 40,
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '10px',
  },
  thumb = image => ({
    position: 'relative',
    background: `url('${image}') center / cover`,
    width: '100%',
    height: (Math.min(500, window.innerWidth) - 60) / 3,
  }),
  excludeButton = {
    position: 'absolute',
    top: 5,
    right: 5,
    height: 30,
    width: 30,
    borderRadius: '50%',
    background: 'rgba(150,150,150,0.5)',
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble = {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    borderRadius: '50%',
    fontFamily: fontTitle,
    fontWeight: '600',
    color: primaryColor,
    background: grayColor3,
  };
