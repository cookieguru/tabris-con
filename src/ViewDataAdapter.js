import _ from "lodash";
import TimezonedDate from "./TimezonedDate";
import FreeBlockInsertor from "./FreeBlockInsertor";

export default class {
  constructor(config, loginService, feedbackService) {
    this._config = config;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
    this._timezone = this._config.CONFERENCE_TIMEZONE;
  }

  adaptPreviewCategories(categories) {
    let previewCategories = _.cloneDeep(categories);
    previewCategories = _.sortBy(previewCategories, "title");
    let result = [this._createLastUpdatedItem()];
    previewCategories.forEach(categoryPreview => {
      this._maybePushTitle(result, categoryPreview);
      result = _.union(result, categoryPreview.sessions.map(
        session => this._adaptSessionListItem(session, "previewSession", {summaryType: "previewText"}))
      );
      if (categoryPreview.sessions.length > 1) {
        result.push({type: "previewCategoriesSpacer"});
      }
      result.push({type: "groupSeparator"});
    });
    return result;
  }

  adaptCategory(category) {
    return this._adaptList("session", category.sessions, {summaryType: "timeframe"});
  }

  adaptTimeframe(category) {
    return this._adaptList("session", category.sessions, {summaryType: "category"});
  }

  adaptSession(session) {
    let startDateString = new TimezonedDate(this._timezone, session.startTimestamp).formatDateAndTime();
    let endTimeString = new TimezonedDate(this._timezone, session.endTimestamp).formatTime();
    let adaptedSession = {
      id: session.id,
      summary: startDateString + " - " + endTimeString + (session.room ? " in " + session.room : ""),
      startTimestamp: session.startTimestamp,
      endTimestamp: session.endTimestamp,
      description: session.description,
      title: session.title,
      image: session.image,
      categoryName: session.categoryName,
      speakers: session.speakers.map(
        speaker => ({
          summary: this._createSpeakerSummary(speaker),
          image: speaker.image || "speaker_avatar",
          twitter: speaker.twitter,
          bio: speaker.bio || ""
        })
      )
    };
    if (session.nid) {
      adaptedSession.nid = session.nid;
    }
    if ("concurrentSessions" in session) {
      adaptedSession.concurrentSessions = session.concurrentSessions;
    }
    return adaptedSession;
  }

  adaptBlocks(blocks) {
    let typedBlocks = blocks.map(block => Object.assign({}, block, {blockType: block.sessionId ? "session" : "block"}));
    let blocksAndFreeBlocks = new FreeBlockInsertor(this._config).insert(typedBlocks);
    return _(blocksAndFreeBlocks)
      .sortBy("startTimestamp")
      .groupBy(block => new TimezonedDate(this._timezone, block.startTimestamp).formatDate())
      .map(datedBlocks => this._mapDatedBlock(datedBlocks))
      .value();
  }

  _maybePushTitle(result, categoryPreview) {
    result.push({
      type: "title",
      id: categoryPreview.id,
      title: categoryPreview.title
    });
  }

  _adaptList(itemType, dataList, options) {
    let separators = this._createSeparators(dataList.length, "iOSLineSeparator");
    let result = [];
    result = _(result)
      .union(
        dataList.map(
          session => this._adaptSessionListItem(session, itemType, {summaryType: options.summaryType})
        )
      )
      .sortBy("startTimestamp")
      .map((block, i) => [block, separators[i]])
      .flatten()
      .pull(undefined)
      .value();
    result.unshift({type: "sessionsSpacer"});
    result.push({type: "sessionsSpacer"});
    return result;
  }

  _mapDatedBlock(datedBlocks) {
    let separators = this._createSeparators(datedBlocks.length, "smallSeparator");
    return {
      day: new TimezonedDate(this._timezone, datedBlocks[0].startTimestamp).formatDate(),
      blocks: _(datedBlocks)
        .sortBy("startTimestamp")
        .map(this._getDatedBlockAdapter())
        .map((block, i) => [block, separators[i]])
        .flatten()
        .pull(undefined)
        .value()
    };
  }

  _getDatedBlockAdapter() {
    return (datedBlock) => {
      let block = {
        image: this._getImageForBlock(datedBlock),
        summary: this._getBlockSummary(datedBlock),
        startTime: new TimezonedDate(this._timezone, datedBlock.startTimestamp).formatTime(),
        startTimestamp: datedBlock.startTimestamp,
        endTimestamp: datedBlock.endTimestamp,
        feedbackIndicatorState: this._getFeedbackIndicatorState(datedBlock),
        blockType: datedBlock.blockType || "session",
        title: datedBlock.title,
        type: "block"
      };
      if ("concurrentSessions" in datedBlock) {
        block.concurrentSessions = datedBlock.concurrentSessions;
      }
      if (datedBlock.sessionId) {
        block.sessionId = datedBlock.sessionId;
      }
      if (datedBlock.sessionNid) {
        block.sessionNid = datedBlock.sessionNid;
      }
      return block;
    };
  }

  _getBlockSummary(datedBlock) {
    let summaryArray = [];
    if (datedBlock.endTimestamp) {
      summaryArray.push(
        [
          new TimezonedDate(this._timezone, datedBlock.startTimestamp).formatTime(),
          new TimezonedDate(this._timezone, datedBlock.endTimestamp).formatTime()
        ].join(" - ")
      );
    }
    if (datedBlock.room) {
      summaryArray.push(datedBlock.room);
    }
    return summaryArray.join(" / ");
  }

  _getFeedbackIndicatorState(session) {
    if (session.sessionNid) {
      return this._feedbackService.canGiveFeedbackForSession(session) &&
        this._loginService.isLoggedIn() ? "loading" : null;
    }
    return null;
  }

  _createSeparators(itemCount, type) {
    let separators = [];
    _.times(itemCount - 1,() => {
      separators.push({type: type});
    });
    return separators;
  }

  _adaptSessionListItem(session, type, options) {
    let self = this;
    return {
      startTimestamp: session.startTimestamp,
      summary: self._getSummary(session, options.summaryType),
      type: type,
      id: session.id,
      image: session.image ? session.image : this._getImageForBlock(session),
      title: session.title,
      categoryName: session.categoryName
    };
  }

  _getSummary(session, summaryType) {
    let typeData = {
      timeframe: [
        new TimezonedDate(this._timezone, session.startTimestamp).formatDateAndTime(),
        new TimezonedDate(this._timezone, session.endTimestamp).formatTime()
      ].join(" - "),
      previewText: session.description,
      category: session.categoryName
    };
    return typeData[summaryType];
  }

  _getImageForBlock(block) {
    let patternIconMap = this._config.SCHEDULE_TYPE_ICON_MAP;
    let icon;
    if (block.type) {
      icon = _.find(patternIconMap,(icon, pattern) => {
        if (block.type.match(pattern)) {
          return icon;
        }
      });
    }
    if (icon) {
      return icon;
    }
    patternIconMap = this._config.SCHEDULE_PATTERN_ICON_MAP;
    return _.find(patternIconMap,(icon, pattern) => {
      if (block.title.match(pattern)) {
        return icon;
      }
    });
  }

  _createSpeakerSummary(speaker) {
    let companyPart = ", " + speaker.company;
    return speaker.name + (speaker.company ? companyPart : "");
  }

  _createLastUpdatedItem() {
    return {type: "lastUpdated", value: localStorage.getItem("lastUpdated")};
  }
}
