import { reaction, makeObservable, observable, action } from 'mobx';
import jwtDecode from 'jwt-decode';

export default class UserStore {
  token = window.localStorage.getItem('santepsytoken');

  constructor() {
    makeObservable(this, {
      token: observable,
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

  isAuthenticated = () => {
    if (!this.token) {
      return false;
    }

    const decoded = jwtDecode(this.token);
    const now = new Date();
    return now.getTime() < decoded.exp * 1000;
  }
}
