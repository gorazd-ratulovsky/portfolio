'use strict';

import {config} from './gulpconfig.js';
import gulp from 'gulp';
import browserSync from 'browser-sync';

import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';

import pug from 'gulp-pug';

import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';


export const server = () => {
	const serverFiles = ['app/**/*.*'],
		serverSettings = {
		server: {
			baseDir: config.paths.dest
		}
	};
	browserSync.init(serverFiles, serverSettings);
};

export const styles = () => {
	return gulp.src(config.paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 4 versions', 'ie >= 9']
		}))
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write(config.paths.styles.maps))
		.pipe(rename({
			basename: "bundle"
		}))
		.pipe(gulp.dest(config.paths.styles.dest))
		.pipe(browserSync.stream());
};

export const templates = () => {
	return gulp.src(config.paths.templates.src)
		.pipe(pug({
			pretty: true,
			doctype: "html"
		}))
		.pipe(gulp.dest(config.paths.templates.dest))
		.pipe(browserSync.stream());
};

export const scripts = () => {
	return gulp.src(config.paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write(config.paths.scripts.maps))
		.pipe(concat('app.js'))
		.pipe(gulp.dest(config.paths.scripts.dest))
		.pipe(browserSync.stream());
};

gulp.task('watch', ['server', 'styles', 'templates', 'scripts'], function(){
	gulp.watch( config.paths.styles.src, ['styles'] );
	gulp.watch( config.paths.templates.src, ['templates'] );
	gulp.watch( config.paths.scripts.src, ['scripts'] );
});

//scripts
//assets
