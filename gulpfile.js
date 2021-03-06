
let fileswatch   = 'html,htm,txt,json,md,woff2'; // List of files extensions for watching & hard reload (comma separated)
let imageswatch  = 'jpg,jpeg,png,webp,svg'; // List of images extensions for watching & compression (comma separated)

const { src, dest, parallel, series, watch } = require('gulp');
const sass         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
//const newer        = require('gulp-newer');
const rsync        = require('gulp-rsync');
//const del          = require('del');


// Local Server

function browsersync() {
	browserSync.init({
		server: { baseDir: 'app' },
		notify: false,
		// online: false, // Work offline without internet connection
	})
}

// Custom Styles

function styles() {
	return src('app/sass/main.*')
	.pipe(eval(sass)())
	.pipe(concat('app.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}

// Scripts & JS Libraries

function scripts() {
	return src([
		'app/libs/gsap.min.js',
		'app/js/app.js' // app.js. Always at the end
		])
	.pipe(concat('main.min.js'))
	//.pipe(uglify()) // Minify JS (opt.)
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

// Images

function images() {
	return src('app/images/**/*')
	//.pipe(newer('app/images/dest'))
	//.pipe(imagemin())
	//.pipe(dest('app/images/dest'))
	.pipe(browserSync.stream())
}

//function cleanimg() {
	//return del('app/images/dest/**/*', { force: true })
//}

// Deploy

function deploy() {
	return src('app/')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

// Watching

function startwatch() {
	watch('app/sass/**/*', parallel('styles'));
	watch(['app/**/*.js', '!app/js/*.min.js'], parallel('scripts'));
	watch(['app/**/*.{' + imageswatch + '}'], parallel('images'));
	watch(['app/**/*.{' + fileswatch + '}']).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
//exports.assets      = series(cleanimg, styles, scripts, images);
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
//exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = parallel(images, styles, scripts, browsersync, startwatch);
