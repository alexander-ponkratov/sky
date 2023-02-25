const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()

//объединение html файлов
function html() {
	return src('src/**/**.html')
		//задание префикса
		.pipe(include({
			prefix: '@@'
		}))
		//.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(dest('dist'))
}

//объединение scss файлов
function scss() {
	return src('src/scss/index.scss')
		.pipe(sass())
		//.pipe(autoprefixer()) //autoprefixer для совместимости
		//.pipe(csso()) //minified css
		.pipe(concat('index.css'))
		.pipe(dest('dist'))
}

//шрифты
function fonts() {
	return src('src/fonts/**.*')
		.pipe(dest('dist/fonts'))
}

//изображения
function img() {
	return src('src/parts/img/**/**.*')
	.pipe(dest('dist/img'))
}
//очистка папки dist перед записью
function clear() {
	return del('dist')
}

function serve() {
	sync.init({
		server: './dist'
	})
	//отслеживание изменений в папках и перезапись
	watch('src/**.html', series(html)).on('change', sync.reload)
	watch('src/parts/**.html', series(html)).on('change', sync.reload)
	watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
	watch('src/parts/img/**/**.*', series(img)).on('change', sync.reload)
}
//команды вида gulp build, gulp serve. Писать в консоли в корне проекта
exports.build = series(clear, scss, html, fonts, img)
exports.serve = series(clear, scss, html, fonts, img, serve)
exports.clear = clear