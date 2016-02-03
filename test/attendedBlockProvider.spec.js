var chai = require("chai");
var persistedStorage = require("../src/data/persistedStorage");
var expect = chai.expect;
var sinon = require("sinon");
var attendedBlockProvider = require("../src/data/attendedBlockProvider");
var conferenceDataProvider = require("../src/data/conferenceDataProvider");
var SESSIONS = require("./data/cod/sessions.json");

describe("attendedBlockProvider", function() {

  beforeEach(function() {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
    conferenceDataProvider.get = sinon.stub();
  });

  it("provides blocks referenced in localStorage", function() {
    var config = {DATA_FORMAT: "cod", CONFERENCE_TIMEZONE: "Europe/Berlin"};
    global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_BLOCK_STORAGE_KEY).returns("[\"20301046\"]");
    conferenceDataProvider.get.returns({sessions: SESSIONS});

    var blocks = attendedBlockProvider.getBlocks(config);

    expect(blocks).to.deep.equal([{
      "sessionId": "20301046",
      "title": "10 Java Idioms Stomped with Xtend",
      "room": "Theater Stage",
      "startTimestamp": "2015-11-05T09:30:00.000Z",
      "endTimestamp": "2015-11-05T10:05:00.000Z"
    }]);
  });

});