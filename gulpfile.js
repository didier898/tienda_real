const { src, dest, watch, series } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imágenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Compilación de CSS
function css() {
    return src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css'));
}

// Optimización de imágenes
function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('dist/img'));
}

// Conversión a formato WebP
function versionWebp() {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('dist/img'));
}

// Conversión a formato AVIF
function versionAvif() {
    const opciones = {
        quality: 50
    };
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('dist/img'));
}

// Mueve los archivos HTML a la carpeta de distribución
function moveHTML() {
    return src('src/**/*.html')
        .pipe(dest('dist'));
}

// Tarea de desarrollo
function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}

// Tarea de construcción
const build = series(imagenes, versionWebp, versionAvif, css, moveHTML);

// Exporta las tareas
exports.build = build;
exports.dev = dev;
exports.default = series(build, dev);
