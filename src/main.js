/*jshint nonew: false*/
import "tabris-js-node";
import "promise.prototype.finally";
import config from "./configs/config";
import TimezonedDate from "./TimezonedDate";
import * as NavigationFactory from "./components/NavigationFactory";
import applyPlatformStyle from "./helpers/applyPlatformStyle";
import LoginAction from "./actions/LoginAction";
import * as RemoteServiceFactory from "./RemoteServiceFactory";
import * as FeedbackServiceFactory from "./helpers/FeedbackServiceFactory";
import * as LoginServiceFactory from "./helpers/LoginServiceFactory";
import {device} from "tabris";

applyPlatformStyle(tabris.ui);

let remoteService = RemoteServiceFactory.create();
let feedbackService = FeedbackServiceFactory.create(remoteService);
let loginService = LoginServiceFactory.create(remoteService);

TimezonedDate.setDateFormats().then(() => {
  NavigationFactory.create(config, remoteService, loginService, feedbackService);
  if (device.get("platform") === "iOS" && config.SUPPORTS_FEEDBACK) {
    new LoginAction(loginService);
  }
});

