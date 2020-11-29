import UserStore from "./user";

export default class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
  }
}
