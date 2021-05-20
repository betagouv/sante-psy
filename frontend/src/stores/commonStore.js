import { action, observable, makeObservable } from 'mobx';

export default class CommonStore {
  config = {};

  notification = null;

  constructor() {
    makeObservable(this, {
      config: observable,
      setConfig: action.bound,
      notification: observable,
      setNotification: action.bound,
    });
  }

  setConfig(config) {
    this.config = config;
  }

  setNotification(notification) {
    console.log(notification);
    this.notification = notification;
  }
}
