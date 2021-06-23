import { reaction, makeObservable, observable, action, computed } from 'mobx';
import jwtDecode from 'jwt-decode';

import agent from 'services/agent';

export default class UserStore {
  user;

  constructor() {
    makeObservable(this, {
      user: observable,
      pullUser: action.bound,
      setUser: action.bound,
    });
  }

  setUser = user => {
    this.user = { ...this.user, ...user };
  }

  pullUser() {
    console.log('pullUser fetching user data from backend');
    return agent.User.getConnected().then(user => {
      this.user = user.data;
    });
  }
  /*
      console.log('pullUser');
    if (this.token) {
      console.log('pullUser has token', this.token)
      if (!this.isTokenExpired()) {
        console.log('pullUser fetching user data from backend')
        return agent.User.getConnected().then(user => {
          this.user = user.data;
        });
      }
    } else {
      this.user = null;
    }

    return Promise.resolve();
  } */
}
