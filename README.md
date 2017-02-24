# Connecta Frontend

Web interface for all Connecta modules.

[![Build Status](https://travis-ci.org/connecta-solutions/connecta-frontend.svg?branch=master)](https://travis-ci.org/connecta-solutions/connecta-frontend)
[![Test Coverage](https://codeclimate.com/github/connecta-solutions/connecta-frontend/badges/coverage.svg)](https://codeclimate.com/github/connecta-solutions/connecta-frontend/coverage)
[![Code Climate](https://codeclimate.com/github/connecta-solutions/connecta-frontend/badges/gpa.svg)](https://codeclimate.com/github/connecta-solutions/connecta-frontend)
[![Issue Count](https://codeclimate.com/github/connecta-solutions/connecta-frontend/badges/issue_count.svg)](https://codeclimate.com/github/connecta-solutions/connecta-frontend)
[![Dependency Status](https://www.versioneye.com/user/projects/58af48656200aa0035dc0243/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58af48656200aa0035dc0243)

## Installation

### Requirements

- NodeJS (https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
- NPM
- Bower
- Grunt
- Karma
- SASS

### Installing Connecta

Run the following commands to install:

```
npm install
bower install
```

**NOTICE - Bower issues with company network:**

Beware that if your company restricts the use of some protocols like `git://`, you may have issues not only with Git but also with Bower (as it uses git for most of the packages in the repository). You can fix that by exchanging the method of downloading the packages to `https://` with the following command:

```
git config --global url."https://".insteadOf git://
```

## Build

To build the frontend, run:

```
$ grunt
```

or

```
$ grunt default
```

Grunt processes and copy the code to the `/dist` folder and removes development-only features.

## Unit testing

To run all tests run the following in the root of the project:

```
$ grunt test
```

Grunt builds the app and then runs all tests in command line using PhantomJS as its browser.

## Running

### Development

To run the app run:

```
$ grunt run
```

Grunt executes the development build and starts a Node Connect HTTP server to serve the **ROOT folder** on port 9001 (or the specified `--port` parameter).

LiveReload is an opt-out feature in the `run` task. If you want to turn it off you can run the command setting `--reload` to `false`:

```
$ grunt run --reload=false
```

Also, if your browser is closed and you want it to instantly open a tab when the server is ready you can run with a `--open` flag:

```
$ grunt run --open
```

### Production

For production use you can either choose to run the frontend as a standalone app or run it in a chosen HTTP server, like Apache HTTP server. The dist folder is just a simple HTML/JS website, so it should fit the simplest web server.

To run as a standalone app, run:

```
$ grunt run-dist
```

Grunt executes the production build and serves the app through the `/dist` folder.

## Generating a .WAR for Java containers

Although **not recommended**, some use cases require deployment in a Java web container alongside the backend applications. If that's the case, run the following command to generate the .war file:

```
$ grunt war-dist
```

## Creating new submodules

Submodules on Connecta have a specific minimum archetype that should exist so it can be recognizable by its architecture. To create new submodules, run the following command passing the name of the module and submodule:

```
$ grunt module --module="the-module-name" --submodule="the-submodule-name"
```
