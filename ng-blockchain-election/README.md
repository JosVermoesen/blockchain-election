# NgBlockchainElection

## Getting started for developers

- [Install NodeJS](https://nodejs.org/). Hint: eventually install and use [nvm](https://medium.com/@Joachim8675309/installing-node-js-with-nvm-4dc469c977d9) for easy installing and/or switching between node versions
- Clone this repository: `git clone https://github.com/JosVermoesen/ng-blockchain-election`.
- Run `npm install` inside the project root.
- Run `ng serve` or `npm start` in a terminal from the project root.
- Profit. :tada:

## Development Tools used for this app

- [NodeJS](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Angular CLI](https://www.npmjs.com/package/@angular/cli): `npm i -g @angular/cli`
- [Remix for ethereum](https://remix.ethereum.org/)
- [Ganache](https://trufflesuite.com/ganache/)
- [Metamask](https://metamask.io/)

## NPM packages used for this app

### 1. bootstrap and bootswatch

`npm i bootstrap bootswatch` to install bootstrap and the open source bootswatch themes

#### set in file styles.scss your prefered theme

```scss
@import "~bootswatch/dist/sandstone/bootstrap.min.css";

// Or use variables, e.g.:
// $h1-font-size: 3rem;
// @import "~bootswatch/dist/[theme]/variables";
// @import "~bootstrap/scss/bootstrap";
// @import "~bootswatch/dist/[theme]/bootswatch";
```

### 2. Apex charting

`npm i apexcharts` to install open source [Apex charting](https://apexcharts.com/) component.

### 3. Web3

`npm i web3 web3-eth-contract` to install the [web3 ethereum](https://github.com/topics/ethereum?q=ethereum%2Fweb3) service component and the web3 contract package.

#### add in file polyfill.ts

```ts
import "zone.js"; // Included with Angular CLI.

import * as process from "process";
import { Buffer } from "buffer";

window.process = process;
(window as any).global = window;
global.Buffer = global.Buffer || Buffer;
```

#### add in file angular.json extra options

```json
"allowedCommonJsDependencies": [
    "hash.js",
    "web3-utils"
],
```

#### for building, increase budgets in angular.json

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "3mb",
    "maximumError": "4mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "2kb",
    "maximumError": "4kb"
  }
],
```

## Updating to latest Angular 18

This app is on Angular 18.

### update app to latest Angular 18

`ng update @angular/cli@18 @angular/core@18`

### update from older Angular versions to the latest

Follow the instructions in the [Angular Update Guide](https://update.angular.io/) to fix your app.

#### npm outdated

In terminal use `npm outdated` to see what packages are requiring updates and what their current and wanted versions are.

This will also show you which packages are deprecated.

If you want to update a package to a version newer than what is specified in your package.json, you can do so by running npm update [package-name]@[version-number].

### Use latest global Angular CLI

`npm i -g @angular/cli`

## Angular Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
