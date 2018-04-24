"use strict";

export default class Gallery {
	constructor() {
		this.init();
	}

	init() {
		let galleries = Array.prototype.slice.call(document.querySelectorAll('.js-project-gallery'));

		galleries.forEach((x, i) => {
			let slider = tns({
				container: x,
				items: 1,
				mouseDrag: true,
				lazyload: true,
				nav: false,
				controlsText: ["", ""],
				slideBy: 'page'
			});
		});
	}
}
