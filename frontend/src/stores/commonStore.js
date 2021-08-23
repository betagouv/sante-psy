import { action, observable, makeObservable } from 'mobx';

export default class CommonStore {
  config = {};

  notification = null;

  psychologists = undefined;

  lastAddressSearch = '';

  constructor() {
    makeObservable(this, {
      psychologists: observable,
      setPsychologists: action.bound,
      lastAddressSearch: observable,
      setLastAddressSearch: action.bound,
      config: observable,
      setConfig: action.bound,
      notification: observable,
      setNotification: action.bound,
    });
  }

  setPsychologists(psychologists) {
    this.psychologists = psychologists;
  }

  setLastAddressSearch(lastAddressSearch) {
    this.lastAddressSearch = lastAddressSearch;
  }

  setConfig(config) {
    this.config = config;
  }

  setNotification(notification, success = true, displayOnlyOnPsyPages = true) {
    this.notification = notification
      ? { message: notification.message, type: success ? 'success' : 'error', displayOnlyOnPsyPages }
      : null;
  }
}
