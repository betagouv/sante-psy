import { reaction, makeObservable, observable, action, computed } from 'mobx';
import jwtDecode from 'jwt-decode';

export default class UserStore {
  token = window.localStorage.getItem('santepsytoken');

  constructor() {
    makeObservable(this, {
      token: observable,
      decodedToken: computed,
      setToken: action.bound,
    });

    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('santepsytoken', token);
        } else {
          window.localStorage.removeItem('santepsytoken');
        }
      },
    );
  }

  setToken(token) {
    this.token = token;
  }

  get decodedToken() {
    return this.token ? jwtDecode(this.token) : undefined;
  }

  isAuthenticated = () => {
    if (!this.decodedToken) {
      return false;
    }

    const now = new Date();
    return now.getTime() < this.decodedToken.exp * 1000;
  }
}
