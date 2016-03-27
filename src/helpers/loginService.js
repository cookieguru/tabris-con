import * as codRemoteService from "../codRemoteService";

export function login(username, password) {
  return codRemoteService
    .login(username, password)
    .then(response => {
      persistUserData(response);
      reloadScheduleItems();
      return Promise.resolve();
    })
    .then(() => maybeTrigger("#loginPage", "loginSuccess"))
    .catch(e => {
      resetUserData();
      return Promise.reject(e);
    })
    .catch(() => maybeTrigger("#loginPage", "loginFailure"));
}

export function logout() {
  return codRemoteService.logout()
    .then(destroySession)
    .catch(() => triggerLogoutFailureEvents());
}

export function destroySession() {
  resetUserData();
  reloadScheduleItems();
  triggerLogoutSuccessEvents();
}

export function isLoggedIn() {
  return !!localStorage.getItem("username");
}

export function getUserData() {
  return {
    username: localStorage.getItem("username"),
    fullName: localStorage.getItem("fullName"),
    mail: localStorage.getItem("mail")
  };
}

function triggerLogoutSuccessEvents() {
  if (device.platform === "iOS") {
    maybeTrigger("#iOSProfilePage", "logoutSuccess");
    maybeTrigger("#loginAction", "logoutSuccess");
  } else {
    maybeTrigger("Drawer", "logoutSuccess");
  }
}

function triggerLogoutFailureEvents() {
  if (device.platform === "iOS") {
    maybeTrigger("#iOSProfilePage", "logoutFailure");
    maybeTrigger("#loginAction", "logoutFailure");
  } else {
    maybeTrigger("Drawer", "logoutFailure");
  }
}

function persistUserData(response) {
  localStorage.setItem("username", response.user.name);
  localStorage.setItem("fullName",
    response.user.field_profile_first.und[0].value +
    " " +
    response.user.field_profile_last.und[0].value
  );
  localStorage.setItem("mail", response.user.mail);
}

function resetUserData() {
  localStorage.setItem("username", "");
  localStorage.setItem("fullName", "");
  localStorage.setItem("mail", "");
}

function maybeTrigger(selector, event) {
  let widget = tabris.ui.find(selector).first();
  if (widget) {
    widget.trigger(event, widget);
  }
}

function reloadScheduleItems() {
  let schedule = tabris.ui.find("#schedule").first();
  if (schedule) {
    schedule.initializeItems();
  }
}
