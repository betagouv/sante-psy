import { reaction, makeObservable, observable, action, computed } from 'mobx';
import jwtDecode from 'jwt-decode';

import agent from 'services/agent';

export default class UserStore {
  token = null; // window.localStorage.getItem('santepsytoken'); // todo get in cookie instead ?
  // avec ca ? https://stackoverflow.com/questions/51109559/get-cookie-with-react

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
        console.log('reaction token : what does this do ?? Token : ', token);
        if (token) {
          window.localStorage.setItem('santepsytoken', token); // todo cookie
        } else {
          window.localStorage.removeItem('santepsytoken'); // todo cookie
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
