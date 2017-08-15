import fecha from "fecha";

let formats = {
  short: {
    date: "MMM d yyy",
    time: "h:mm a"
  },
  medium: {
    "date and time": "MMMM d yyyy h:mm a"
  }
};

export default class {
  constructor(timezone, date, format) {
    if (format) {
      this._date = fecha.parse(date, format);
    } else {
      this._date = new Date(date);
    }
  }

  toJSON() {
    return this._date.toISOString();
  }

  formatTime() {
    return fecha.format(this._date, formats.short.time);
  }

  formatDate() {
    return fecha.format(this._date, formats.short.date);
  }

  formatDateAndTime() {
    return fecha.format(this._date, formats.medium["date and time"]);
  }

  static setDateFormats() {
    return new Promise((resolve) => {
      let promises = [];
      for (let length in formats) {
        for (let selector in formats[length]) {
          //noinspection JSUnfilteredForInLoop
          promises.push(setFormat(length, selector));
        }
      }
      ["narrow", "wide"].forEach((type) => {
        ["months", "days"].forEach((items) => {
          promises.push(setNames(type, items));
        });
      });
      Promise.all(promises).then(resolve);
    });
  }
}

/**
 * @param {("short"|"medium"|"long"|"full")} length
 * @param {("date"|"time"|"date and time")} selector
 * @private
 * @return {Promise<string>}
 */
function setFormat(length, selector) {
  return new Promise((resolve) => {
    navigator.globalization.getDatePattern((obj) => {
      formats[length][selector] = obj.pattern.replace(/\b[yY]{1,4}\b/, "YYYY"); // Workaround for CB-13178 and fecha shortcoming
      // fecha is not compliant with UTR #35.  yyyy is correct, but fecha will only accept YY or YYYY
      resolve();
    }, resolve, {
      formatLength: length,
      selector: selector
    });
  });
}

/**
 * @param {("narrow"|"wide")} type
 * @param {("days"|"months")} items
 * @private
 * @return {Promise<string>}
 */
function setNames(type, items) {
  let map = {
    "narrowdays": "dayNamesShort",
    "narrowmonths": "monthNamesShort",
    "widedays": "dayNames",
    "widemonths": "monthNames"
  };

  return new Promise((resolve) => {
    navigator.globalization.getDateNames((obj) => {
      fecha.i18n[map[type + items]] = obj.value;
      resolve();
    }, resolve, {
      type: type,
      item: items
    });
  });
}
