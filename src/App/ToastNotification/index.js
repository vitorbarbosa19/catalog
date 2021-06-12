import React from 'react';
import ToastNotification from '@bit/vitorbarbosa19.ziro.toast-notification';
import Icon from '@bit/vitorbarbosa19.ziro.icon'
import { toastStyle, labelStyle } from './styles';
import { alertColor } from '@ziro/theme'

export default ({ openToastRoot, setOpenToastRoot, messageToastRoot }) => {
  return (
    <ToastNotification isOpen={openToastRoot} setIsOpen={setOpenToastRoot} boxStyle={toastStyle}>
      <Icon type='alert' color={alertColor} />
      <label style={labelStyle}>{messageToastRoot}</label>
    </ToastNotification>
  );
};
