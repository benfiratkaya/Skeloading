const { src, series, parallel, dest, task, watch } = require("gulp");

let autoprefixer = require("gulp-autoprefixer"),
  cleanCss = require("gulp-clean-css"),
  cssbeautify = require("gulp-cssbeautify"),
  postcss = require("gulp-postcss"),
  rename = require("gulp-rename"),
  del = require("del"),
  sass = require("gulp-sass");

// Define paths
var paths = {
  base: {
    node: "node_modules"
  },
  examples: {
    base: "examples",
    css: "examples/assets/css"
  },
  src: {
    base: "src",
    css: "src/css",
    scss: "src/scss"
  }
};

// Compile SCSS
task("compile:scss", function(done) {
  return src(paths.src.scss + "/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([require("postcss-flexbugs-fixes")]))
    .pipe(autoprefixer())
    .pipe(
      cssbeautify({
        indent: "  "
      })
    )
    .pipe(dest(paths.src.css));

  done();
});

// Minify CSS
task("minify:css", function(done) {
  return src(paths.src.css + "/*.css")
    .pipe(cleanCss())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(dest(paths.src.css));

  done();
});

// Copy CSS
task("copy:css", function(done) {
  return src(paths.src.css + "/*.css").pipe(dest(paths.examples.css));
  done();
});

// Clean CSS
task("clean:css", function(done) {
  return del(paths.src.css);
  done();
});

// Bundled tasks
task("css", series("clean:css", "compile:scss", "minify:css", "copy:css"));

// Watch Files
task("watchFiles", function(done) {
  watch(paths.src.scss, series("css"));
});

// Default Tasks
task("default", series("css", "watchFiles"));
