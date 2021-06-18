import { reaction, makeObservable, observable, action, computed } from 'mobx';
import jwtDecode from 'jwt-decode';

import agent from 'services/agent';

export default class UserStore {
  token = window.localStorage.getItem('santepsytoken');

  user;

  constructor() {
    makeObservable(this, {
      token: observable,
      user: observable,
      decodedToken: computed,
      setToken: action.bound,
      pullUser: action.bound,
      setUser: action.bound,
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

  isTokenExpired = () => {
    const now = new Date();
    return now.getTime() > this.decodedToken.exp * 1000;
  }

  setUser = user => {
    this.user = { ...this.user, ...user };
  }

  pullUser() {
    if (this.token) {
      if (!this.isTokenExpired()) {
        return agent.User.getConnected().then(user => {
          this.user = user.data;
        });
      }
    } else {
      this.user = null;
    }

    return Promise.resolve();
  }
}
