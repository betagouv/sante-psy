import { makeObservable, observable, action, reaction, runInAction } from 'mobx';

import agent from 'services/agent';

export default class UserStore {
  user;

  role;

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
  }

  setRole = role => {
    this.role = role;
  };

  setUser = user => {
    this.user = { ...this.user, ...user };
  };

  pullUser() {
    if (this.role === 'student') {
      return agent.Student.getConnected()
        .then(user => {
          this.user = user.data;
        });
    }
    return agent.Psy.getConnected()
      .then(user => {
        this.user = user.data;
      });
  }

  setXsrfToken(xsrfToken) {
    this.xsrfToken = xsrfToken;
    return this.pullUser();
  }

  deleteToken() {
    return agent.Psy.logout().then(() => {
      this.user = null;
      this.xsrfToken = null;
      this.role = null;
    });
  }

  seeTutorial() {
    return agent.Psychologist.seeTutorial().then(() => {
      runInAction(() => {
        this.user.hasSeenTutorial = true;
      });
    });
  }
}
