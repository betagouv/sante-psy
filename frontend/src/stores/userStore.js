import { reaction, makeObservable, observable, action } from 'mobx';
import jwtDecode from 'jwt-decode';

import agent from 'services/agent';

export default class UserStore {
  token = window.localStorage.getItem('santepsytoken');

  user;

  constructor() {
    makeObservable(this, {
      token: observable,
      user: observable,
      setToken: action.bound,
      pullUser: action.bound,
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

  isTokenExpired = () => {
    const decoded = jwtDecode(this.token);
    const now = new Date();
    return now.getTime() > decoded.exp * 1000;
  }

  pullUser() {
    if (this.token) {
      if (!this.isTokenExpired()) {
        return agent.User.getConnected().then(user => {
          this.user = user;
        });
      }
    } else {
      this.user = null;
    }

    return Promise.resolve();
  }
}
