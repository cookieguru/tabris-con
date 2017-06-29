export default {
  DATA_TYPE: "cod",
  CONFERENCE_NAME: "PNWPHP 2017",
  SERVICES: {
    LOGIN: null,
    LOGOUT: null,
    CSRF_TOKEN: null,
    EVALUATIONS: null,
    SESSIONS: "https://raw.githubusercontent.com/cookieguru/tabris-con/pnwphp/json/pnwphp/scheduled_sessions.json"
  },
  SUPPORTS_FEEDBACK: false,
  SESSIONS_HAVE_IMAGES: false,
  BUNDLED_DATA_TIME: "27.06.2016 14:00",
  CONFERENCE_TIMEZONE: "America/Los_Angeles",
  FEEDBACK_START: "01.01.2000 00:00",
  FEEDBACK_DEADLINE: "01.01.2000 23:59",
  IGNORED_BLOCKS: "",
  SCHEDULE_TYPE_ICON_MAP: {
    "keynote": "conference_selected",
    "panel": "schedule_icon_panel",
    "workshop": "schedule_icon_workshop"
  },
  SCHEDULE_PATTERN_ICON_MAP: {
    "(^Lunch|Lunch$)": "schedule_icon_food",
    "(^Break|Break$)": "schedule_icon_break",
    "(Drinkup|WurstCon|Party)": "schedule_icon_fun",
    "(Networking|Social$)": "schedule_icon_dialog",
    "BROWSE SESSIONS": "schedule_icon_plus",
    ".*": "schedule_icon_session"
  },
  FREE_BLOCKS: [],
  TRACK_COLOR: {
  },
  IGNORED_BLOCK_PATTERN: "^Reserved for",
  TWITTER_TITLE: "PNWPHP",
  COLOR_SCHEME: {
    TINT_COLOR: "#0A6C85",
    ANDROID_ACTION_AREA_FOREGROUND_COLOR: "#ffffff",
    ANDROID_ACTION_AREA_BACKGROUND_COLOR: "#0A6C85",
    IOS_ACTION_AREA_FOREGROUND_COLOR: "#0A6C85",
    WINDOWS_ACTION_AREA_FOREGROUND_COLOR: "#ffffff",
    WINDOWS_ACTION_AREA_BACKGROUND_COLOR: "#0A6C85",
    BACKGROUND_COLOR: "#0A6C85",
    INFO_TOAST_BACKGROUND_COLOR: "#323232",
    ACTION_COLOR: "#FFC107",
    BUTTON_COLOR: "#443684",
    ERROR_COLOR: "#F44336",
    DRAWER_TEXT_COLOR: "rgba(0, 0, 0, 0.78)",
    DARK_PRIMARY_TEXT_COLOR: "rgba(0, 0, 0, 0.87)",
    DARK_SECONDARY_TEXT_COLOR: "rgba(0, 0, 0, 0.54)",
    LIGHT_PRIMARY_TEXT_COLOR: "rgba(255, 255, 255, 1)",
    LIGHT_SECONDARY_TEXT_COLOR: "rgba(255, 255, 255, 0.7)",
    LIGHT_TEXT_COLOR: "#ffffff",
    ACCENTED_TEXT_COLOR: "#3BAFDA",
    LIGHT_BACKGROUND_COLOR: "#efefef",
    DRAWER_LIST_ITEM_BACKGROUND: {
      iOS: "#efefef",
      Android: "#efefef",
      windows: "#0A6C85"
    },
    LINE_SEPARATOR_COLOR: "#d9d9d9",
    MAP_BACKGROUND_COLOR: "#cdcbcc",
    LINK_COLOR: "#48a8f4",
    ANDROID_BUTTON_DISABLED_BACKGROUND: "#aba1d5",
    WINDOWS_DRAWER_BUTTON_BACKGROUND: "rgb(103,86,186)",
    WINDOWS_DRAWER_ICON_TINT: "#fff",
    ANDROID_DRAWER_ICON_TINT: "#757575",
    ANDROID_DRAWER_ICON_SELECTED_TINT: "#f09424"
  },
  DRAWER_HEADER_THEME: "light",
  WINDOWS_DRAWER_THEME: "dark",
  WINDOWS_DRAWER_BUTTON_THEME: "dark",
  WINDOWS_UI_TOOLBAR_THEME: "light",
  WINDOWS_UI_THEME: "light",
  BUNDLED_CONFERENCE_DATA: {
    scheduledSessions: "../json/pnwphp/scheduled_sessions.json"
  }
};
