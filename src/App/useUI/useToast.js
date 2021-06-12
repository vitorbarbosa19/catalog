import { useGlobalCache } from '@bit/vitorbarbosa19.ziro.flow-manager';

const OPEN_TOAST = Symbol('OPEN_TOAST');
const MESSAGE_TOAST = Symbol('MESSAGE_TOAST');

export const useToast = () => {
  const [openToast, setOpenToast] = useGlobalCache(false, OPEN_TOAST);
  const [messageToast, setMessageToast] = useGlobalCache(null, MESSAGE_TOAST);
  return { openToast, setOpenToast, messageToast, setMessageToast };
};
