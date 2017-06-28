// jscs:disable maximumLineLength
import getImage from "../helpers/getImage";
import Navigatable from "./Navigatable";
import appConfig from "../configs/config";
import {WebView} from "tabris";
import texts from "../resources/texts";

export default class extends Navigatable {
  constructor({viewDataProvider}) {
    super({
      configuration: {
        id: "twitter",
        title: texts.TWITTER_PAGE_TITLE.replace("*", appConfig.TWITTER_TITLE),
        image: getImage.forDevicePlatform("twitter"),
        left: 0, top: 0, right: 0, bottom: 0
      },
      viewDataProvider
    });
    new WebView({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      background: "transparent",
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width">
        <style>
          body{margin:0}
          a.twitter-timeline{visibility:hidden}
        </style>
        <script src="http://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </head>
      <body>
        <a
          class="twitter-timeline"
          data-chrome="noheader nofooter"
          data-dnt="true"
          data-show-replies="true"
          data-widget-id="873704820074467328"
          href="https://twitter.com/search?q=from%3APNWPHP%20OR%20to%3APNWPHP%20OR%20%40PNWPHP%20OR%20%23PNWPHP%20OR%20PNWPHP"// jscs:ignore maximumLineLength
        >Tweets about from:PNWPHP OR to:PNWPHP OR @PNWPHP OR #PNWPHP OR PNWPHP</a>
      </body>
      </html>`
    }).on("navigate", function(webView, event) {
      if (event.url.substr(0, 4) !== "http") {
        return;
      }
      if (cordova.InAppBrowser) {
        cordova.InAppBrowser.open(event.url, "_system");
        event.preventDefault();
      } else {
        console.error("cordova-plugin-inappbrowser is not available in this Tabris.js client.");
      }
    }).appendTo(this);
  }
}
