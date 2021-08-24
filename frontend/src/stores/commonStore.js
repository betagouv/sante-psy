import { action, observable, makeObservable } from 'mobx';

export default class CommonStore {
  config = {};

  notification = null;

  statistics = undefined;

  searchPsychologists = undefined;

  constructor() {
    makeObservable(this, {
      statistics: observable,
      setStatistics: action.bound,
      searchPsychologists: observable,
      setSearchPsychologists: action.bound,
      config: observable,
      setConfig: action.bound,
      notification: observable,
      setNotification: action.bound,
    });
  }

  setStatistics(statistics) {
    this.statistics = statistics;
  }

  setSearchPsychologists(searchPsychologists) {
    this.searchPsychologists = searchPsychologists;
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
