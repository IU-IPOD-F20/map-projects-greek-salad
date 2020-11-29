import { action, observable } from "mobx";

export default class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  type = "";

  @observable type = "";

  @action
  setType = (type) => {
    this.type = type;
  };
}
