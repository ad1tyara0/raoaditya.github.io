---
layout: posts
title: "Getting started with Babel."
date: 2017-10-08
comments: true
---

![Babel Logo](/assets/images/babel-logo.png)


[Babel][5] is a Javascript transpiler. A transpiler is a compiler that converts source code from one language to another language. In this case, Babel coverts latest Javascript language features into browser compatible version.

## Understanding Babel

ECMA committee for Javascript, _TC39_ has decided to make incremental updates to the language in a yearly release cycle. It will take some time for browser engines to support these features, and these will only be available for latest browsers. 
If you want to use latest features in your project today you will need to convert this Javascript code into browser compatible version. This problem can be solved using a transpiler like Babel.

## Prerequisites

- **Javascript** (ECMAScript 2015/2016/2017)
- Your system should have [**Node**][6] installed.
- You can use [**npm**][7] or [**yarn**][8] as package manager.

## Installation - Babel (Global & Local)

To install Babel **locally** (as recommended) use :

```shell
# Using yarn
yarn add -D babel-cli

# Using npm
npm install --save-dev babel-cli
```
{: data-title="Bash"}

Locally installing babel will let you run different versions of babel for different projects. 

If you want to install it **globally** (not recommended) use :

```shell
# Using yarn
yarn add global babel-cli

# Using npm
npm install --global babel-cli
```
{: data-title="Bash"}



To get started with Babel you need to understand **five** core concepts:

- Using Babel through command-line.
- Plugins
- Using .babelrc configuration file.
- Presets
- Polyfill


## babel-cli - Using Babel through command-line

You can guess from the name that `babel-cli` installs the core babel programme with a command line interface. It gives access to a set of commands to run and configure babel for our javascript files.
Let's use Babel and learn some useful commands.

Create a directory **babel-demo** and install Babel (locally).
```shell
mkdir babel-demo && cd babel-demo

touch index.html source.js

yarn init -y

yarn add -D babel-cli
```
{: data-title="Bash"}

Fill `index.html` with following code :

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Babel Demo</title>
</head>
<body>
<h1>Testing Babel</h1>
<script src="source.js"></script>
</body>
</html>
```
{: data-title="HTML"}

and `source.js`:

```javascript
// Script changes background color of body every three seconds.

let bgcolor = ['DarkTurquoise', 'Beige', 'LemonChiffon', 'Salmon'];

setInterval(() => {
  document.body.style.backgroundColor = bgcolor[Math.floor(Math.random()*4)];
}, 3000);
```
{: data-title="Javascript"}

We are using **arrow function** and **let** keyword here which are introduced in ECMAScript 2015. `Arrow function` uses a fat arrow symbol, doesn't use function keyword, and for single statements braces are optional. The `let` keyword introduces block scoping to Javascript. Let's transpile this ES6 code to ES5 using Babel.
Enter the following command in your command-line :

```shell
node_modules/babel-cli/bin/babel.js source.js
```
{: data-title="Bash"}

You can see the following output as a result :

```shell
let bgcolor = ['DarkTurquoise', 'Beige', 'LemonChiffon', 'Salmon'];

setInterval(() => {
  document.body.style.backgroundColor = bgcolor[Math.floor(Math.random()*4)];
}, 3000);
```
{: data-title="Bash"}

Note: `node_modules/babel-cli/bin/babel.js` points to `babel-cli` installed locally.
{: class="note"}

The babel output is the same ES6 code we wrote. So, why didn't babel apply any transformations to `source.js` ?

## Plugins

By default, Babel will take code from `source.js` and simply output the same code _as is_ to the command line -- the standard output.
You need to tell Babel what feature you want it to transpile, using a **plugin**. There exist a plugin for every new feature introduced in the language. 
We'll use `es2015-arrow-functions` and `es2015-block-scoping` plugin for our use case.

We install the plugin before using it.
```shell
# Using yarn
yarn add -D babel-plugin-transform-es2015-arrow-functions babel-plugin-transform-es2015-block-scoping

# Using npm
npm install --save-dev babel-plugin-transform-es2015-arrow-functions babel-plugin-transform-es2015-block-scoping
```
{: data-title="Bash"}

In order to use the plugins we pass the `--plugin` option with comma separated list of plugins to help babel transpile our `source.js`.

```shell
node_modules/babel-cli/bin/babel.js --plugins=transform-es2015-arrow-functions,babel-plugin-transform-es2015-block-scoping source.js
```
{: data-title="Bash"}

Babel will output the following result :
```shell
# Compiled source.js

var bgcolor = ['DarkTurquoise', 'Beige', 'LemonChiffon', 'Salmon'];

setInterval(function () {
  document.body.style.backgroundColor = bgcolor[Math.floor(Math.random() * 4)];
}, 3000);
```
{: data-title="Bash"}

We can see babel transpiles our _**arrow function**_ to _**anonymous function expression**_ and replaces the _**let**_ keyword with _**var**_. This code is compatible with all the browsers that have implemented ES5, which is about [97.88%][9].

## .babelrc - Babel Configuration file

There are a few problems which are immediately apparent from the above code -

1. Using CLI for Babel will get messier when you have a lot of features to compile.
2. You need to install a plugin for every new feature you use otherwise babel will not transpile that feature.

The first issue can be resolved by using `npm-scripts` and `.babelrc` file. The `.babelrc` file is a Babel configuration file that sits at the root of our project. We can list all transformation plugins we would want to use on our project in the `.babelrc` file. With the plugins listed in a single location, we don't have to pass the `--plugins` option to babel command. We can also make use of `npm-scripts` to save us some typing. 

Let's see how it works :

Create `.babelrc` file and list the plugin as shown:
```json
{
  "plugins": [
    "transform-es2015-arrow-functions",
    "babel-plugin-transform-es2015-block-scoping"
  ]
}
```
{: data-title="Javascript"}

Include the following script in `package.json`:
```json
{
  "scripts": {
    "babel": "node_modules/babel-cli/bin/babel.js"
  }
}
```
{: data-title="Javascript"}

Now instead of typing `node_modules/babel-cli/bin/babel.js` every time we want to use babel we can use `yarn babel` or `npm run babel` to compile our file. 

Compile `source.js`

```shell
# Using yarn
yarn babel source.js

# Using npm
npm run babel source.js
```
{: data-title="Bash"}

We don't need to specify any plugins since babel will search for `.babelrc` file for configuration. We get the same compiled output as before.

```shell
# Compiled source.js

var bgcolor = ['DarkTurquoise', 'Beige', 'LemonChiffon', 'Salmon'];

setInterval(function () {
  document.body.style.backgroundColor = bgcolor[Math.floor(Math.random() * 4)];
}, 3000);
```
{: data-title="Bash"}

It's likely that we will use many plugins for all the new feature we want to use and `.babelrc` makes it easier to list and maintain all plugins and presets(we'll learn about presets next) and their options.

By default, Babel will output the compiled code to standard output i.e your shell. To output the compiled code to a file we use `--out-file` or `-o` option with output file name.

```shell
# Using yarn
yarn babel source.js -o main.js

# Using npm
npm run babel source.js -o main.js
```
{: data-title="Bash"}

Open `main.js` to see the compiled output.



Now, there is an opportunity here to make use of `npm-scripts`. Since we know that we have one `source.js` with our source code, and one output file `main.js` that contains the transformation applied by Babel, we can edit `package.json` to add a new script.

```json
{
  "scripts": {
    "babel": "node_modules/babel-cli/bin/babel.js",
    "babel:build": "babel source.js -o main.js"
  }
}
```
{: data-title="Javascript"}

Now instead of typing `yarn babel source.js -o main.js` we'll simply use `yarn babel:build`.

To learn what other options babel-cli offers use `babel --help`. For more examples of using Babel with command-line visit [Babel CLI][1] page.

## Presets

We learned **how to install plugins**, **using .babelrc file** and **babel-cli**, but the second problem still remains. Installing the plugins individually for all the features we want to use is inefficient and a bit time-consuming. To address this babel offers **presets**.

**Babel presets** are a collection of similar plugins that we might want to use in our project. So instead of installing the plugins individually we just install the presets once and Babel will apply the transformation for the features that are supported by the presets. If we can't find the plugin we want in the preset of our choosing then we can install it separately and specify it in the plugins array.

Let's see how to use presets.

First, lets will uninstall the plugins we installed previously :

```shell
# Using yarn
yarn remove -D babel-plugin-transform-es2015-arrow-functions babel-plugin-transform-es2015-block-scoping

# Using npm
npm uninstall --save-dev babel-plugin-transform-es2015-arrow-functions babel-plugin-transform-es2015-block-scoping
```
{: data-title="Bash"}

We will install a preset from the [list of presets available][2]. We choose `babel-preset-env`, as it won't compile ES2015+ syntax if it knows that the target browsers support it. It's the "Autoprefixer for Javascript". It compiles only what we use to make our bundle size smaller. 

```shell
# Using yarn
yarn add -D babel-preset-env

# Using npm
npm install --save-dev babel-preset-env
```
{: data-title="Bash"}

Remove the `plugins` property from the `.babelrc` file and include the following property.

```json
{
   "presets": ["env"]
}
```
{: data-title="Javascript"}

Run `yarn babel:build` or `npm run babel:build` and confirm that babel has transpiled your code, as it did use `plugins` array with plugins installed separately.



Using `presets` in CLI :

```shell
# Using yarn
yarn babel source.js --presets es2015

# Using npm
npm run babel source.js --presets es2015
```
{: data-title="Bash"}

When using more than one preset we specify the option using a comma-separated list of presets, like so: `--presets=es2015,react`.



The babel ecosystem has tons of plugins and configuration options.  We can configure `babel-preset-env` to target only the environment of our choice, uglify the output, target certain browsers etc. 

The following code shows some of the configuration options available for `preset-env`.

```json
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "> 10%"]
      },
      "modules": false
    }]
  ],
```
{: data-title="Javascript"}

We have two options in the configuration object. The `targets.browsers` property is a list of environments that we want to support. We want to target the last two versions of every major browser and all the browser versions that have more than 10% of usage. It uses [browserlist][3] to specify the target browsers.

The `"modules": false` property will prevent transformation of ES6 module syntax to another module type.

Additional configuration options and values can be found [here][4].



## Polyfills

According to Remy Sharp, [who coined the term polyfill][10] -

> A polyfill, or polyfiller, is a piece of code (or plugin) that provides the technology that you, the developer, expect the browser to provide _natively_.
>

Babel will transpile the syntax changes introduced in ES2015+, to browser compatible versions using plugins/presets. There may be new features added to ECMAScript such as built-in objects like Promises and WeakMap, as well as new static methods like Array.from or Object.assign. These features are not implemented in older browsers and in order to allow you to use the full set of ES2015+ features beyond syntax changes Babel provides [`babel-polyfill`][11].

### How to use babel-polyfill ?

We install `babel-polyfill` using :

```shell
# Using yarn
yarn add babel-polyfill

# Using npm
npm install --save babel-polyfill
```
{: data-title="Bash"}

For npm we use `--save` and **not** `--save-dev` because `babel-polyfill` is a _dependency_ not a _dev dependency_. For the same reason, we exclude `-D` from yarn command.

To use the polyfill we include it in `index.html` file like so :

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Babel Demo</title>
</head>
<body>
<h1>Testing Babel</h1>
<script src="node_modules/babel-polyfill/dist/polyfill.js"></script>
<script src="source.js"></script>
</body>
</html>
```
{: data-title="HTML"}

`polyfill.js` should be sourced before any other script. 

If we want to use `require()` or ES6 `import` statements then make sure that `babel-polyfill` is included at the top of the **entry point** to your application ensure the polyfills are loaded first.

```javascript
// Using 'require'
require("babel-polyfill");

// Using 'import'
import "babel-polyfill";
```
{: data-title="Javascript"}


## Conclusion

Babel is highly configurable transpiler that allows you to use future syntax, today. It is smart enough to transform the code only if it isn't supported by the current environment. It can be integrated with build systems like Gulp, Webpack, Grunt etc.

In a separate post, I'll show you how to integrate babel with webpack.


<div class="line"></div>


[1]: https://babeljs.io/docs/usage/cli/	"Babel CLI"
[2]: https://babeljs.io/docs/plugins/#presets	"List of presets by Babel"
[3]: https://github.com/ai/browserslist	"Browserlist"
[4]: https://babeljs.io/docs/plugins/preset-env#options	"preset-env - Babel recommended preset"
[5]: https://babeljs.io/	"BabelJS"
[6]: https://nodejs.org/en/	"NodeJS"
[7]: https://www.npmjs.com/	"npm"
[8]: https://yarnpkg.com/en/	"Yarn"
[9]: https://caniuse.com/#search=ES5	"Can I Use - ECMAScript 5"
[10]: https://remysharp.com/2010/10/08/what-is-a-polyfill	"What is a Polyfill? - Remy Sharp"
[11]: https://babeljs.io/docs/usage/polyfill	"How to use the babel polyfill?"