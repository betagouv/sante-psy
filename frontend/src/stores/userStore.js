import { makeObservable, observable, action, reaction } from 'mobx';

import agent from 'services/agent';

export default class UserStore {
  user;

  xsrfToken = window.localStorage.getItem('xsrfToken');

  constructor() {
    makeObservable(this, {
      user: observable,
      xsrfToken: observable,
      pullUser: action.bound,
      setUser: action.bound,
      setXsrfToken: action.bound,
      deleteToken: action.bound,
    });

    reaction(
      () => this.xsrfToken,
      xsrfToken => {
        if (xsrfToken) {
          window.localStorage.setItem('xsrfToken', xsrfToken);
        } else {
          window.localStorage.removeItem('xsrfToken');
        }
      },
    );
  }

  setUser = user => {
    this.user = { ...this.user, ...user };
  }

  pullUser() {
    return agent.User.getConnected()
      .then(user => {
        this.user = user.data;
      });
  }

  setXsrfToken(xsrfToken) {
    this.xsrfToken = xsrfToken;
    return this.pullUser();
  }

  deleteToken() {
    this.xsrfToken = null;
    return agent.User.logout().then(() => {
      this.user = null;
    });
  }
}
