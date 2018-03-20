const globalSrc = 'app/';
const globalDest = 'dist/';

export const config = {
	paths: {
		dest: globalDest,
		styles: {
			src: `${globalSrc}scss/**/*.scss`,
			dest: `${globalDest}styles/`,
			maps: './maps'
		},
		templates: {
			src: `${globalSrc}pug/**/*.pug`,
			dest: `${globalDest}`
		},
		scripts: {
			src: `${globalSrc}js/**/*.js`,
			dest: `${globalDest}scripts/`,
			maps: './maps'
		}
	}
}