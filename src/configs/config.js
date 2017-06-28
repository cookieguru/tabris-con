import conferenceConfiguration from "./pnwphp2017Config";

let vendorConfiguration = {
  VENDOR: "PNWPHP",
  VENDOR_WEBSITE: "http://pnwphp.com/",
  PROJECT_URL: "https://github.com/cookieguru/tabris-con"
};

const CONFIGURATION = Object.freeze(
  Object.assign({}, vendorConfiguration, conferenceConfiguration)
);

export default CONFIGURATION;
