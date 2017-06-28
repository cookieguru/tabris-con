import * as DataExtractorFactory from "./DataExtractorFactory";
import CreateTabrisConPreviewCategories from "./CreateTabrisConPreviewCategories";
import FilterTabrisConCategories from "./FilterTabrisConCategories";

export function createFromRawData(config, rawData) {
  let data;

  if (config.DATA_TYPE !== "tabrisCon") {
    let dataExtractor = DataExtractorFactory.create(config, rawData);
    data = {
      sessions: dataExtractor.extractSessions(),
      blocks: dataExtractor.extractBlocks()
    };
  } else {
    data = rawData;
  }

  return {
    sessions: data.sessions,
    blocks: data.blocks,
    previewCategories:
      CreateTabrisConPreviewCategories.fromSessions(data.sessions),
    categories: FilterTabrisConCategories.fromSessions(data.sessions)
  };
}
