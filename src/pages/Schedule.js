import CollectionView from "../components/collectionView/TabrisConCollectionView";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import LoadingIndicator from "../components/LoadingIndicator";
import getImage from "../helpers/getImage";
import {select} from "../helpers/platform";
import Navigatable from "./Navigatable";
import {TabFolder, Tab, TextView, Composite} from "tabris";
import _ from "lodash";
import texts from "../resources/texts";
import sizes from "../resources/sizes";
import colors from "../resources/colors";
import TimezonedDate from "../TimezonedDate";

export default class extends Navigatable {
  constructor({viewDataProvider}) {
    super({
      configuration: {
        id: "schedule",
        title: texts.MY_SCHEDULE_PAGE_TITLE,
        image: getImage.forDevicePlatform("schedule_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
        left: 0, top: 0, right: 0, bottom: 0
      },
      viewDataProvider
    });

    let loadingIndicator = new LoadingIndicator().appendTo(this);

    this.once("change:data", (widget, blocks) => {
      loadingIndicator.dispose();
      let lastUpdatedBox = new Composite({
        left: 0, top: 0, right: 0, height: 32,
        background: select({
          android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
          default: "initial"
        }),
        textColor: select({
          android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
          default: colors.IOS_ACTION_AREA_FOREGROUND_COLOR
        })
      }).appendTo(this);
      new TextView({
        id: "lastUpdated",
        font: select({
          android: "italic bold 14px",
          default: "italic 12px sans-serif"
        }),
        opacity: select({android: 0.6, default: 1}),
        textColor: select({
          android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
          default: colors.DARK_SECONDARY_TEXT_COLOR
        }),
        centerX: select({
          ios: 0,
          default: null
        }),
        left: select({
          android: sizes.LEFT_CONTENT_MARGIN,
          windows: sizes.MARGIN + sizes.MARGIN_SMALL,
          ios: null
        }),
        top: select({
          android: 0,
          default: sizes.MARGIN + sizes.MARGIN_SMALL
        })
      }).appendTo(lastUpdatedBox);
      let tabFolder = new TabFolder({
        id: "scheduleTabFolder",
        layoutData: {left: 0, top: lastUpdatedBox, right: 0, bottom: 0},
        elevation: 4,
        tabBarLocation: blocks.length <= 1 ? "hidden" : "top",
        paging: true
      }).appendTo(this);
      applyPlatformStyle(tabFolder);
      this._createTabs(tabFolder, blocks);
    });

    this.on("change:data", (widget, blocks) => {
      let lastUpdated = localStorage.getItem("lastUpdated");
      let date = new TimezonedDate(null, lastUpdated);
      this.find("#lastUpdated").set("text", `${texts.LAST_UPDATED} ${date.formatDateAndTime()}`);
      blocks.forEach(blockObject => {
        let collectionView = this.find("#" + blockObject.day);
        collectionView.set("items", blockObject.blocks);
      });
    });

    this.on("change:focus", (widget, focus) => this.set("shouldFocusSessionWithId", focus));

    this.on("appear", () => {
      if (this.get("initializingItems")) {
        this.once("change:initializingItems", maybeFocusItem);
      } else {
        maybeFocusItem(this);
      }
      this._updateFeedbackIndicators();
    });

    tabris.app.on("resume", () => this._updateFeedbackIndicators());
  }

  getSessionIdTab(sessionId) {
    let index = _.findIndex(this.get("data"), object => {
      return _.some(object.blocks, block => sessionId === block.sessionId);
    });
    return this.children("#scheduleTabFolder").children()[index];
  }

  initializeItems() {
    if (!this.get("initializingItems")) {
      this.set("initializingItems", true);
      return this.getViewDataProvider().getBlocks()
        .then(data => {
          this.set("data", data);
          this._initializeIndicators();
        })
        .catch(e => {
          console.log(e);
          console.log(e.stack);
        })
        .finally(() => {
          this.find("CollectionView").set("refreshIndicator", false);
          this.children("#loadingIndicator").dispose();
          this.set("initializingItems", false);
        });
    }
  }

  updateSessionWithId(id, property, value) {
    let collectionView = getItemCollectionView(this, id);
    if (collectionView) {
      let items = collectionView.get("items");
      let index = _.findIndex(items, {sessionId: id});
      items[index][property] = value;
      collectionView.refresh(index);
    }
  }

  findSessionById(sessionId) {
    let found;
    this.get("data").forEach((blockObject) => {
      blockObject.blocks.forEach(block => {
        if (block.sessionId === sessionId) {
          found = block;
        }
      });
    });
    return found;
  }

  _initializeIndicators() {
    if (!this.get("indicatorsInitialized") && !this.get("evaluatedSessionId")) {
      this._updateAllFeedbackIndicators();
      this.set("indicatorsInitialized", true);
    }
  }

  _updateFeedbackIndicators() {
    if (this.get("evaluatedSessionId")) {
      this._updateEvaluatedSessionIndicator();
    } else {
      this._updateAllFeedbackIndicators();
    }
  }

  _updateEvaluatedSessionIndicator() {
    if (this.get("evaluatedSessionId")) {
      this.updateSessionWithId(this.get("evaluatedSessionId"), "feedbackIndicatorState", "sent");
      this.set("evaluatedSessionId", null);
    }
  }

  _updateAllFeedbackIndicators() {
    this._updateEvaluatedSessionIndicator();
    this.getViewDataProvider().getSessionIdIndicatorStates()
      .then(idStates => {
        if (this.get("focusing")) {
          this.once("change:focusing", () => this._applyIdStates(idStates));
        } else {
          this._applyIdStates(idStates);
        }
      });
  }

  _applyIdStates(idStates) {
    idStates.forEach(idState => this.updateSessionWithId(idState.id, "feedbackIndicatorState", idState.state));
  }

  _createTabs(tabFolder, adaptedBlocks) {
    adaptedBlocks.forEach(blockObject => {
      let tab = createTab(blockObject.day).appendTo(tabFolder);
      let collectionView = new CollectionView({
        left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
        id: blockObject.day,
        items: blockObject.blocks,
        updatable: true
      }, this.getViewDataProvider()).appendTo(tab);
      collectionView.animate({opacity: 1}, {duration: 250});
    });
  }
}

function getItemCollectionView(schedule, sessionId) {
  let tab = schedule.getSessionIdTab(sessionId);
  return tab ? tab.find("CollectionView").first() : null;
}

function maybeFocusItem(schedule) {
  let sessionId = schedule.get("shouldFocusSessionWithId");
  if (sessionId) {
    schedule.set("shouldFocusSessionWithId", null);
    schedule.set("focusing", true);
    let tab = schedule.getSessionIdTab(sessionId);
    if (tab) {
      schedule.children("#scheduleTabFolder").set("selection", tab);
      let collectionView = tab.children("CollectionView").first();
      let collectionViewItems = collectionView.get("items");
      let index = _.findIndex(collectionViewItems, item => item.sessionId === sessionId);
      if (index === -1) {
        return;
      }
      collectionView.get("items")[index].shouldPop = true;
      if (collectionView.get("bounds").height === 0) { // TODO: workaround for reveal only working after resize on iOS
        collectionView.once("resize", () => {
          collectionView.reveal(index);
          notFocusing(schedule);
        });
      } else {
        collectionView.reveal(index);
        notFocusing(schedule);
      }
    }
  }
}

function notFocusing(schedule) {
  setTimeout(() => {
    schedule.set("focusing", false);
  }, 2000);
}

function createTab(title) {
  return new Tab({title: title, background: "white"});
}
