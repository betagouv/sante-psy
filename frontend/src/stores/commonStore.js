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

  setNotification(notification, success = true, displayOnlyOnPsyPages = true) {
    this.notification = notification ? { message: notification.message, success, displayOnlyOnPsyPages } : null;
  }
}
