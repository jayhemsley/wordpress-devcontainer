const mix = require('laravel-mix');
const path = require('path');
const glob = require('glob');

const srcPath = './src';
const distPath = './dist';

/**
 * Mix Configuration
 */

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
  processCssUrls: false,
});

mix.disableSuccessNotifications();

/**
 * Handle SCSS
 * 
 * Processes SCSS files that do not start with an underscore.
 * i.e. `app.scss` will be processed, `_component.scss` will not.
 * So only `app.min.css` will be output.
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
 * Operates the same as SCSS.
 */

const jsFiles = glob.sync(`${srcPath}/js/**/!(_)*.js`);

jsFiles.forEach(file => {
  const output = path.join(
    `${distPath}/js`,
    path.relative(`${srcPath}/js`, file.replace(/\.js$/, '.min.js'))
  );

  mix.js(file, output);
});

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