import { createContext, useContext } from 'react';
import CommonStore from './commonStore';
import UserStore from './userStore';

class RootStore {
  constructor() {
    this.commonStore = new CommonStore();
    this.userStore = new UserStore();
  }
}

export const store = new RootStore();
const StoreContext = createContext(store);
export const useStore = () => useContext(StoreContext);
