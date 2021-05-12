import { action, observable, makeObservable } from 'mobx';

export default class CommonStore {
  config = {};

  constructor() {
    makeObservable(this, {
      config: observable,
      setConfig: action.bound,
    });
  }

  setConfig(config) {
    this.config = config;
  }
}
