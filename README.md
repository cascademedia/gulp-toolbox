Gulp Toolbox
============

An asset, JavaScript, SASS, and Browser Sync management tool to aid in the development cycle.

Installation
============

```
npm install gulp-toolbox
```

Usage
=====

Minimum requirements to enable all default functionality:

1. Create gulpfule.js with the following information:
```
var gulp = require('gulp');
var toolbox = require('gulp-toolbox');

var config = {
    assets: {
        enabled: true
    },
    js: {
        enabled: true
    },
    sass: {
        enabled: true
    },
    sync: {
        enabled: true
    }
};

toolbox.init(gulp, config);
```

2. In your command line type the following command to start the Gulp watchers:
```
gulp
```

What it Does
============

###Assets

Takes all assets and moves them to a target location for front-end use in the application.

###JavaScript

Separated into two parts, libraries and source files. Takes all files and concatenates them together into a single file for front-end use in the application.

Can be modified with --production to minify the target file and --sourcemaps to provide sourcemaps on the target file.

###SASS

Takes all files and concatenates them together into a single file for front-end use in the application.

Can be modified with --production to minify the target file and --sourcemaps to provide sourcemaps on the target file.

###Sync

Starts a live reload system in the browser that watches for file changes to automatically reload the browser.


Configurations
==============

###Global
**production**: default: false

Turns on minification of JavaScript and SASS target files.

Can also be enabled on the command line:

```
gulp --production
```

**sourcemaps**: default: false

Turns on sourcemaps for JavaScript and SASS target files.

Can also be enabled on the command line:

```
gulp --sourcemaps
```

###Assets

**assets.origin**: default: app/resources

Defines the folder where all assets are located.

**assets.target**: default: web/resources

Defines the folder where all assets will be moved.

**assets.glob**: default: [ 'fonts/\*\*', 'images/\*\*' ]

Defines origin assets files and folders.

###JavaScript

####Libraries

**js.libs.origin**: default: app/resources/js/libs

Defines the folder where libraries are located.

**js.libs.target**: default: web/resources/js

Defines the folder where libraries will be compiled.

**js.libs.file**: default: libs.js

Defines the file created in the target directory.

**js.libs.glob**: default: [ '\*\*/\*.js' ]

Defines the origin libraries files and folders.

```
Example to load libraries in order:

config.js.libs.glob = [
    'jquery.min.js',
    'lodash.min.js'
];
```

####Source

**js.src.origin**: default: app/resources/js

Defines the folder where source files are located.

**js.src.target**: default: web/resources/js

Defines the folder where source files will be compiled.

**js.src.file**: default: main.js

Defines the file created in the target directory.

**js.src.glob**: default: [ '\*.js' ]

Defines the source file libraries files and folders.

```
Example to include entire "/plugins" directory:

config.js.src.glob = [
    'plugins/**/*.js'
    '*.js'
];
```

###SASS

**sass.origin**: default: app/resources

Defines the folder where all sass files are located.

**sass.target**: default: web/resources

Defines the folder where all sass files will be compiled.

**sass.file**: default: main.css

Defines the file created in the target directory.

**sass.glob**: default: [ '\*\*/\*.scss' ]

Defines origin assets files and folders.

###Sync

**sync.glob**: default: [ 'web/resources/**' ]

Defines files and folders that are watched for changes to issue a reload to the live browser syncing.

**sync.server.host**: default: 127.0.0.1

Local server host for browser syncing.

**sync.server.proxy**: default: http://localhost:8081/

Local server proxy website location.

**sync.server.port**: default: 8082

Syncing server port to use.

**sync.server.notify**: default: false

Sends notifications to the desktop with updates during syncing.

Gulp Tasks
==========

####Default

Starts all enabled watchers and browser sync.

```
gulp
```

####Compile

Compiles all assets and moves them to the target directories.

```
gulp compile
```

There is also access to compile JavaScript and SASS separately with the following commands:

```
gulp js:compile
gulp sass:compile
```

####Watch

Starts only the enabled watchers.

```
gulp watch
```

There is also access to watch JavaScript and SASS separately with the following commands:

```
gulp js:watch
gulp sass:watch
```

License
========

[MIT](LICENSE.md)
