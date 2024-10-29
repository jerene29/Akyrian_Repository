// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// const wp = require('@cypress/webpack-preprocessor');
require('dotenv').config()
const { initPlugin } = require('cypress-plugin-snapshots/plugin');
const browserify = require('@cypress/browserify-preprocessor');
const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');

const { rmdir } = require('fs')


module.exports = (on: any, config: any) => {
  // const options = {
  //   // options here
  //   typescript: require.resolve('typescript'),
  //   extensions: ['.js', '.ts'],
  //   plugin: [['tsify']]
  // };

  config.env.REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL
  config.env.REACT_CYPRESS_API_URL = process.env.REACT_CYPRESS_API_URL
  config.env.TESTRUNNER_ENV = process.env.TESTRUNNER_ENV

  const options = browserify.defaultOptions;
  options.browserifyOptions.transform[1][1].babelrc = true;
  options.typescript = require.resolve('typescript');

  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      // ^ make sure this is your browser name, you may 
      // be using 'canary' or 'chromium' for example, so change it to match!
      args.push('--proxy-bypass-list=<-loopback>')
      args.push('--ignore-gpu-blacklist')
      return args
    }

    if (browser.name === 'chromium') {
      const newArgs = args.filter(arg => arg !== '--disable-gpu')
      newArgs.push('--ignore-gpu-blacklist')
      return newArgs;
    }
  })

  on('file:preprocessor', browserify(options));
  on('task', {
    deleteFolder(folderName: any) {
      console.log('deleting folder %s', folderName)

      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err: any) => {
          if (err) {
            console.error(err)

            return reject(err)
          }

          resolve(null)
        })
      })
    },
    csvToJson(data: any) {
      let temp = data.replace(/\"/g, "");  
      let lines = temp.split("\n");
      let result = [];
      let headers=lines[0].split(",");

      for(let i=1; i<lines.length; i++){
          var obj: any = {};
          var currentline=lines[i].split(",");
    
          for(let j=0; j<headers.length; j++){
              obj[headers[j]] = currentline[j];
          }
          result.push(obj);
      }
      console.log(result);
      return result;
    },
  })

  initPlugin(on, config);
  addMatchImageSnapshotPlugin(on, config);

  return config;
};