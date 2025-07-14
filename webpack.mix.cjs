const mix = require('laravel-mix');
const path = require('path');
const glob = require('glob');

/**
 * Configuration
 */

const srcPath = './src';
const distPath = './dist';

mix.setResourceRoot('../');
mix.setPublicPath(distPath);

mix.webpackConfig({
  watchOptions: {
    ignored: [
      path.posix.resolve(__dirname, './devcontainer'),
      path.posix.resolve(__dirname, './node_modules'),
      path.posix.resolve(__dirname, './acf-json'),
    ]
  }
});

mix.options({
  manifest: false, // This is only used for Laravel SPAs.
  processCssUrls: false, // Maybe we can enable this in the future?
});

mix.disableSuccessNotifications(); // We only need to be notified on build failure.

/**
 * Handle SCSS
 * 
 * Processes SCSS files that do not start with an underscore.
 * i.e. `app.scss` will be processed, `_component.scss` will not.
 * So only `app.min.css` will be output.
 * 
 * Currently, the `npm run watch` script doesn't detect when new non-imported SCSS files are
 * created. However, this is not a regression from the previous setup as the original only
 * watched specific CSS files. This can be fixed by using something like chokidar to have an
 * additional script manage watching but it's not a big issue here as we don't create new top
 * level SCSS files often. Imported SCSS remains unaffected and operates how it did previously.
 * 
 * There is no real feature loss moving from PostCSS to SCSS. Mix handles autoprefixing and
 * minification by default.
 */

const scssFiles = glob.sync(`${srcPath}/scss/**/!(_)*.scss`);

scssFiles.forEach(file => {
  const output = path.join(
    `${distPath}/css`,
    path.relative(`${srcPath}/scss`, file.replace(/\.scss$/, '.min.css'))
  );

  mix.sass(file, output, {
    sassOptions: {
      outputStyle: 'compressed'
    }
  });
});

/**
 * Handle JS
 * 
 * Operates the same as the SCSS handler, with the same caveats.
 */

const jsFiles = glob.sync(`${srcPath}/js/**/!(_)*.js`);

jsFiles.forEach(file => {
  const output = path.join(
    `${distPath}/js`,
    path.relative(`${srcPath}/js`, file.replace(/\.js$/, '.min.js'))
  );

  mix.js(file, output);
});

/**
 * Handle BrowserSync
 * 
 * This probably needs to be handled outside of Laravel Mix for it to work.
 * Currently it serves and detects changes in files correctly, but doesn't reload or inject CSS
 * into pages. This is just due to a missing .js dependency which is auto injected when this is
 * running. When manually added it resolves the problem and has it working, but that's a bandaid
 * fix and not really an appropriate solution.
 */

// mix.browserSync({
//     proxy: 'http://localhost:8080/',
//     open: false,
//     notify: false,
//     files: [
//       'dist/css/**/*.min.css',
//       'dist/js/**/*.min.js',
//       '**/*.php'
//     ],
// });