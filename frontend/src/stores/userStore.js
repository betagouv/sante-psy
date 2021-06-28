import { makeObservable, observable, action } from 'mobx';

import agent from 'services/agent';

export default class UserStore {
  user;

  constructor() {
    makeObservable(this, {
      user: observable,
      pullUser: action.bound,
      setUser: action.bound,
      deleteToken: action.bound,
    });
  }

  setUser = user => {
    this.user = { ...this.user, ...user };
  }

  pullUser() {
    return agent.User.getConnected().then(user => {
      this.user = user.data;
    });
  }

  deleteToken() {
    return agent.User.logout().then(() => {
      this.user = null;
    });
  }
}
