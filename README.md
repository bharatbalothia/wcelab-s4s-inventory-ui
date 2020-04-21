# S4S Supply Viewing UI

UI to allow S4S users to search supplies and suppliers' information.

## Platform

This UI is based on [IBM Business User Control](https://mediacenter.ibm.com/media/IBM+Order+Management+-+OMS+Business+User+Controls+overview/0_9ddzh4ku) framework.

## Use cases

1. Authorized users search for items available in S4S (with or without knowning what items that S4S inventory)
2. Authorized users search for suppliers and locations for an item
3. Authorized users views the contact information of a supplier

## Dev Setup 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.3.

## Development server

Run `yarn start` for a dev server. Navigate to `https://localhost:9000/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## BUC Menu Item Setup (One time per user)

In order for see this custom app in BUC, you can add a new left navigation menu item in BUC from BUC Settings -> Customization. Please follow the following steps to add a main menu item with 2 sub menus.


1. Go to BUC Settings -> Customization
2. Click on Create New
3. Fill in the form with these proposed values:

    Feature id: custom-rapid-inventory

    Title: Rapid Inventory

    Path: /rapid-inventory

    Url: https://s4s-inventory-ui.mybluemix.net/buc-iv-covid-poc

    Local development mode url: https://bucgenerichost:9000/buc-iv-covid-poc

    Child features:
```
[
  {
    "featureId": "custom-rapid-inventory-scarce-supply",
    "state": "ACTIVE",
    "parentFeatureId": "custom-rapid-inventory",
    "sequence": 1,
    "title": "Search Scarce Supply",
    "link": "https://s4s-inventory-ui.mybluemix.net/buc-iv-covid-poc/home/homepage1",
    "devModeLink": "https://localhost:9000/buc-iv-covid-poc/home/homepage1",
    "path": "/rapid-inventory/scarce-supply",
    "hidden": false,
    "allowedRoles": [ "Fulfillment Manager" ],
    "description": [ { "title": "Search Scarce Supply", "locale": "en_US", "language": "en" } ],
    "type": "IFRAME",
    "featureType": "UserNavigationFeature"
  },
  {
  
    "featureId": "custom-rapid-inventory-search-iventory",
    "state": "ACTIVE",
    "parentFeatureId": "custom-rapid-inventory",
    "sequence": 2,
    "title": "Search Inventory",
    "link": "https://s4s-inventory-ui.mybluemix.net/buc-iv-covid-poc/home/search-iventory",
    "devModeLink": "https://localhost:9000/buc-iv-covid-poc/home/search-iventory",
    "path": "/rapid-inventory/search-iventory",
    "hidden": false,
    "allowedRoles": [ "Fulfillment Manager" ],
    "description": [ { "title": "Search Inventory", "locale": "en_US", "language": "en" } ],
    "type": "IFRAME",
    "featureType": "UserNavigationFeature"
  },
  {
    "featureId": "custom-rapid-inventory-upload-inventory",
    "state": "ACTIVE",
    "parentFeatureId": "custom-rapid-inventory",
    "sequence": 3,
    "title": "Upload Inventory",
    "link": "https://s4s-inventory-ui.mybluemix.net/buc-iv-covid-poc/home/upload",
    "devModeLink": "https://localhost:9000/buc-iv-covid-poc/home/upload",
    "path": "/rapid-inventory/upload-inventory",
    "hidden": false,
    "allowedRoles": [ "Tenant Administrator" ],
    "description": [ { "title": "Upload Inventory", "locale": "en_US", "language": "en" } ],
    "type": "IFRAME",
    "featureType": "UserNavigationFeature"
  },
  {
    "featureId": "custom-rapid-inventory-upload-demand",
    "state": "ACTIVE",
    "parentFeatureId": "custom-rapid-inventory",
    "sequence": 4,
    "title": "Upload Demand",
    "link": "https://s4s-inventory-ui.mybluemix.net/buc-iv-covid-poc/home/upload-demand",
    "devModeLink": "https://localhost:9000/buc-iv-covid-poc/home/upload-demand",
    "path": "/rapid-inventory/upload-demand",
    "hidden": false,
    "allowedRoles": [ "Tenant Administrator" ],
    "description": [ { "title": "Upload Demand", "locale": "en_US", "language": "en" } ],
    "type": "IFRAME",
    "featureType": "UserNavigationFeature"
  }
]
```

4. Click on Save all changes
5. Reload BUC and you should see the new menu and 3 submenus
6. Now, make sure that you have started the customization app and is running locally on your environment
7. Click the new menu items in BUC to launch the different pages in your customization app

**Alternately, for services team, a common starter user has been created with this setup: ibm id- nimit1test@mailinator.com (credentials can be shared and will not be in git).**

## Setup

1. Setup your development environment by installing the latest version of [Node.js](https://nodejs.org/en/download/releases/) LTS 10.x series. If multiple node versions are required, it will be preferable to use [nvm](https://github.com/nvm-sh/nvm) (for Mac or Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (for Windows).
2. Install [Git](https://git-scm.com/).
3. Install [Yarn](https://yarnpkg.com/en/docs/install).
4. Preferably complete: [Connecting to GitHub with SSH](https://help.github.com/en/articles/connecting-to-github-with-ssh)
5. `npm install -g @angular/cli@8.3.3`: Install Angular CLI 8.3.3 globally.
6. `git clone git@github.ibm.com:WCI/buc-iv-covid-poc.git`: Clone buc-iv-covid-poc git repo.
7. `cd buc-iv-covid-poc`: Enter the directory.
8. Setup .npmrc credentials: [link](https://github.ibm.com/WCI/buc-lib-angular/wiki/Adding-or-modifying-.npmrc-file).
9. `ng config -g cli.packageManager yarn`: Set yarn as the package manager for this Angular CLI based project.
10. `yarn install`: Install all dependencies using Yarn.
11. `yarn start`: This will start the local development server over https at: `https://localhost:9000/buc-iv-covid-poc`. Application can now be accessed from the ribbon in BUC. Since this angular https server does not have a valid certificate, you will not view the application in the ribbon on every server restart. Just copy the url above in a new tab and accept the certificate error - this creates the exception in browser for the certificate. After that click on the link again in BUC to access the application.
12. Detailed steps on how the application was created and reason for various libraries used is in this doc [wiki](https://github.ibm.com/WCI/buc-lib-angular/wiki/Utilizing-buc-library-in-any-angular-application)


## Deploying on IBM Cloud

The deployment branch of this project is connected to IBM Cloud CD/CI DevOps pipeline. Any checkin into the deployment branch triggers a build and deploy of the porject. 

The deployment url is - http://s4s-inventory-ui.mybluemix.net/

1. Create a new toolchain 
2. Create a build stage
3. Builder type - npm
4. Build script
```
#!/bin/bash
export NVM_DIR=/home/pipeline/nvm
export NODE_VERSION=13.12.0
export NVM_VERSION=0.29.0

npm config delete prefix \
  && curl https://raw.githubusercontent.com/creationix/nvm/v${NVM_VERSION}/install.sh | sh \
  && . $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default \
  && node -v \
  && npm -v

npm install --global yarn && \
npm install -g @angular/cli@8.3.3 && \
ng config -g cli.packageManager yarn && \
yarn install && \
yarn build
```

5. Create a deploy stage
6. Deployer type: Cloud Foundry
7. Application name: s4s-inventory-ui
8. Deploy script
```
#!/bin/bash
cf push "${CF_APP}"

```
