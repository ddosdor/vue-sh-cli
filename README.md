```
 __     __                             ____    _          ____   _       ___
 \ \   / /  _   _    ___              / ___|  | |__      / ___| | |     |_ _|
  \ \ / /  | | | |  / _ \    _____    \___ \  | '_ \    | |     | |      | |
   \ V /   | |_| | |  __/   |_____|    ___) | | | | |   | |___  | |___   | |
    \_/     \__,_|  \___|             |____/  |_| |_|    \____| |_____| |___|

```
# @ddosdor/vue-sh-cli
## What is this?

This is my awesome CLI tools for scaffolding apps that was made with Vue.js.

## Why I made this?

Because I can ;) But for real - I love Vue.js and all my last apps was made with this awesome framework. That's why I created a tool that makes my job easier.

## Where to get it from?

It's simple:

```
npm install -g @ddosdor/vue-sh-cli
```

or

```
yarn add global @ddosdor/vue-sh-cli
```

## How to use this?

After installing this tool, the following command will be available in the console:

```cmd
vsh menu
```

results:
```cmd

    Usage: vsh [command] [options]

    Commands:
      menu      ........................ show CLI menu
      component ........................ create new component from template
      view      ........................ create new view from template
      module    ........................ create new Vuex module from template
      filter    ........................ create new filter from template
```

#### Create new component
In order to create a new component, you should enter in the console:
```cmd
vsh component --name MyNewAwesomeComponent
```

As a result, a new component will be created, according to the following structure:
```cmd
- src
  | - components
      | - MyNewAwesomeComponent
          | - component.js
          | - index.vue
          | - style.sass
```
I prefer components as a separate files, so:

`component.js` - this file is for compononent logic
`index.vue` - this file is main Vue component file
`style.sass` - this file is for style (for now only with SASS) 


The tool also allows you to generate a component as a single file component using the options:
```cmd
vsh component --name MyAwesomeComponent --sfc
```
As a result, a new component will be created, according to the following structure:
```cmd
- src
  | - components
      | - MyNewAwesomeComponent.vue
```
##### Available options

```cmd
Available options:
  - name (*required)      ....... name of the new component
  - single (optional)     ....... create component as a single *.vue file
  - functional (optional) ....... new component is created as a functional component
  - parent (optional)     ....... creates a new component in the folder provided in the option
  - test (optional)       ....... generate unit test for component

Example:
  * Create component with 'MyAwesomeComponent' name as a separate files (*.sass, *.js, *.vue)
  in 'src/components/MyAwesomeComponent' directory:

  $: vsh component --name MyAwesomeComponent --functional


  * Create component with 'MyAwesomeFunctionalSingleComponent' as a single file component
  in 'src/components/CommonComponents/' directory:

  $: vsh component --name MyAwesomeFunctionalSingleComponent --functional --single --parent CommonComponents
```
###### Help
`vsh component --help`

#### Create new view
In order to create a new component, you should enter in the console:
```cmd
vsh view --name MyNewAwesomeVuew
```

As a result, a new view will be created, according to the following structure:
```cmd
- src
  | - view
      | - MyNewAwesomeView.vue
```
This command generate **view** always as a single file component.

##### Available options
```cmd
Available options:
  - name (*required)      ....... name of the new component
  - parent (optional)     ....... creates a new component in the folder provided in the option
  - test (optional)       ....... create unit test for view

Example:
  * Create view with 'MyNewView' name in 'src/views/MyNewView' directory:

  $: vsh view --name MyNewView


  * Create view with 'MyNewView' as a single file component in 'src/views/UserProfile/' directory:

  $: vsh view --name MyNewView --parent UserProfile
```
###### Help
`vsh view --help`

#### Create new Vuex module
In order to create a new component, you should enter in the console:
```cmd
vsh module --name MyNewModule
```

As a result, a new Vuex module will be created, according to the following structure:
```cmd
- src
  | - store
      | - modules
          | - MyNewModule
              | - actions.js
              | - index.js
              | - mutations-type.js
              | - mutations.js
```
As with the component, I prefer the division of responsibility into individual files:
`actions.js` - all actions for new module
`index.js` - main file for new module (here is initial state and all getters)
`mutations-type.js` - all available mutations types for new module
`mutations.js` - all mutations

##### Available options
```cmd
Available options:
  - name (*required)      ....... name of the new module

Example:
  * Create Vuex module with 'MyModule' name

  $: vsh module --name MyModule
```
###### Help
`vsh module --help`

## Change default settings
There are several options that you can change by your preferences. To do this, in root folder of your app, call the command:
```cmd
vsh init
```
As a result, a `.vshclirc.json` file will be created. Here some setting, that can be changed.

##### Project structure
```json
  "directories": {
    "views": "views",
    "components": "components",
    "vuex": "store",
    "modules": "modules",
    "unitTests": "__tests__"
  }
```
Here you can indicate in which folders new items are to be created. For example, if in your project all the views from the router are in a folder called 'pages', you can indicate it in this way:
```json
...
"views": "pages",
...
```

##### Default settings
```json
  "settings": {
    "rootSrcDirectory": "src",
    "alwaysCreateSpecFiles": true,
    "defaultComponentStyle": "separate"
  },
```
Here youe can change some default settings:

**rootSrcDirectory** - source directory in your project. For example, if main root folder is also your source folder (like in Nuxt.js apps), you can indicate this like: 
```json
...
"rootSrcDirectory": "/",
...
```
**alwaysCreateSpecFiles** - here you can decide whether to always create a unit test for it when generating a new component or view. Default is: **false**

**defaultComponentStyle** - default style when genereting new component, set: `separate` if you prefer the division of responsibility into individual files, or `sfc` if you want *Single File Component*.

## What next?

I still have some ideas that I would like to implement for this tool. So far, this is a beta version, that's why every feedback is welcome. :)

---
#### Our blogs

See [Meanstack.eu - voil](http://meanstack.eu/)
See [Meandjs - ddosdor](http://meandjs.com/)

License
----

MIT


**Ready to Rock&Roll, Hell Yeah!**