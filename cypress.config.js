const { defineConfig } = require('cypress');
const Jimp = require('jimp');

module.exports = defineConfig({
  projectId: "p1r321",
  reporter: 'cypress-multi-reporters',
  reporter: 'mocha-junit-reporter',
  reporter: 'mochawesome',

  reporterOptions: {
    "configFile": "reporter-config.json" , 
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: false,
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/reports/junit/results-[hash].xml',
      mochaFile: 'results/junit-results.xml',

    },
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
      reportPageTitle: 'custom-title',
    },
  },
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        
        async redactImage({ imagePath, redactionCoords }) {
            try {
              console.log('Reading image from path:', imagePath);

                const image = await Jimp.read(imagePath);

                redactionCoords.forEach(({ x, y, width, height }) => {
                    image.scan(x, y, width, height, (x, y, idx) => {
                        image.bitmap.data[idx] = 0;       // Red
                        image.bitmap.data[idx + 1] = 0;   // Green
                        image.bitmap.data[idx + 2] = 0;   // Blue
                    });
                });

                await image.writeAsync(imagePath);
                return null;
            } catch (error) {
                console.error('Error redacting image:', error);
                throw error; // Rethrow to fail the test if needed
            }
        }
    });
},
},
});