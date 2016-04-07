import ViewDataProvider from "./ViewDataProvider";
import ConferenceDataProvider from "./ConferenceDataProvider";
import AttendedBlockProvider from "./AttendedBlockProvider";
import BundledConferenceData from "./BundledConferenceData";
import ViewDataAdapter from "./ViewDataAdapter";
import * as NewDataFetcherFactory from "./NewDataFetcherFactory";

export function create(config, remoteService, loginService, feedbackService) {
  let bundledConferenceData = BundledConferenceData.create(config);
  let viewDataAdapter = new ViewDataAdapter(config, loginService, feedbackService);
  let conferenceDataProvider = new ConferenceDataProvider(bundledConferenceData);
  if (config.SERVICE_URL) {
    conferenceDataProvider.setNewDataFetcher(NewDataFetcherFactory.create(config));
  }
  let attendedBlockProvider = new AttendedBlockProvider(conferenceDataProvider);
  return new ViewDataProvider({
    config, conferenceDataProvider, attendedBlockProvider, viewDataAdapter, remoteService, loginService, feedbackService
  });
}