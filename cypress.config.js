const { defineConfig } = require('cypress');
const Jimp = require('jimp');

module.exports = defineConfig({
  projectId: "p1r321",
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/reports/junit/results-[hash].xml',
    },
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
      reportPageTitle: 'custom-title',
    },
  },
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      
      on('task', {
        async redactImage({ imagePath, redactionCoords }) {
          const image = await Jimp.read(imagePath);

          // Loop through each redaction area and apply a black rectangle
          redactionCoords.forEach(({ x, y, width, height }) => {
            image.scan(x, y, width, height, (x, y, idx) => {
              image.bitmap.data[idx] = 0;       // Red
              image.bitmap.data[idx + 1] = 0;   // Green
              image.bitmap.data[idx + 2] = 0;   // Blue
            });
          });

          // Save the modified image
          await image.writeAsync(imagePath);
          return null; // Indicate that the task completed successfully
        }
      });
    },
  },
});