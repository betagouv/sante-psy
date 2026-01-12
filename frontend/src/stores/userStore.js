import { makeObservable, observable, action, reaction, runInAction } from 'mobx';

import agent from 'services/agent';

export default class UserStore {
  user;

  role = window.localStorage.getItem('role');

  xsrfToken = window.localStorage.getItem('xsrfToken');

  constructor() {
    makeObservable(this, {
      user: observable,
      xsrfToken: observable,
      role: observable,
      pullUser: action.bound,
      setUser: action.bound,
      setRole: action.bound,
      setXsrfToken: action.bound,
      deleteToken: action.bound,
      seeTutorial: action.bound,
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

    reaction(
      () => this.role,
      role => {
        if (role) {
          window.localStorage.setItem('role', role);
        } else {
          window.localStorage.removeItem('role');
        }
      },
    );
  }

  setRole = role => {
    this.role = role;
  };

  setUser = user => {
    this.user = { ...this.user, ...user };
  };

  async pullUser() {
    return agent.Auth.getConnected()
      .then(user => {
        console.log(user);
        this.user = user.data.user;
        this.role = user.data.role;
      });
  }

  async setXsrfToken(xsrfToken) {
    this.xsrfToken = xsrfToken;
    return this.pullUser();
  }

  async deleteToken() {
    return agent.Psy.logout().then(() => {
      this.user = null;
      this.xsrfToken = null;
      this.role = null;
    });
  }

  async seeTutorial() {
    return agent.Psychologist.seeTutorial().then(() => {
      runInAction(() => {
        this.user.hasSeenTutorial = true;
      });
    });
  }
}
