import { makeObservable, observable, action } from 'mobx';

import agent from 'services/agent';

export default class UserStore {
  user;

  constructor() {
    makeObservable(this, {
      // token: observable,
      user: observable,
      // decodedToken: computed,
      // setToken: action.bound,
      logout: action.bound,
      pullUser: action.bound,
    });
  }

  logout() {
    return agent.User.logout();
  }

  pullUser() {
    return agent.User.getConnected().then(user => {
      console.log('USER', user);
      if (user) {
        this.user = user.data;
      } else {
        this.user = null;
      }
    });
  }
}
