import CreateTabrisConCategories from "./FilterTabrisConCategories";

export default class {
  static fromSessions(tabrisConSessions) {
    return [
      ...CreateTabrisConCategories.fromSessions(tabrisConSessions, {sessionLimit: 2})
    ];
  }
}
