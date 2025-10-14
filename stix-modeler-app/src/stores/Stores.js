import { createContext, useContext } from 'react';

import AppStore from './App';

export const store = {
  appStore: new AppStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
