export default {
  directories: {
    views: "views",
    components: "components",
    vuex: "store",
    modules: "modules",
    unitTests: "__tests__"
  },
  settings: {
    version: 2,
    lang: "js",
    rootSrcDirectory: "src",
    alwaysCreateSpecFiles: false,
    defaultComponentStyle: "separate"
  },
  aliases: {
    commands: {
      component: "c",
      view: "v",
      module: "m",
      get: "g"
    },
    options: {
      name: "n",
      single: "s",
      parent: "p",
      functional: "f",
      test: "t",
      source: "s",
      help: "h"
    }
  }
}