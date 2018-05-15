"use strict";

export default class LogoTyper {
	constructor(initElement, changeElement) {
		var self = this;
		this.morphing = window.NavMorphing;

		this.mainElement = document.querySelector(initElement);
		this.randomLogos = ['gorazd—design', 'gorazd—interactive', 'gorazd—coding', 'gorazd—digital'];
		this.changeLogoElements = Array.prototype.slice.call(document.querySelectorAll(changeElement));

		this.firstLogo(this.mainElement.dataset.firstLogo);

		this.addHoverEvents(self);
	}

	firstLogo(first) {
		this.letterToArray(first);
	}

	changeLogo(logo) {
		let string = Number.isInteger(logo) ? this.randomLogos[logo] : logo;

		this.letterToArray(string);
	}

	letterToArray(_string) {
		let string = _string;
		let stringArray = [];

		for (var i = 0; i < string.length; i++) {
			stringArray.push(string[i]);
		}

		this.wrapLetter(stringArray);

		return;
	}

	wrapLetter(letters) {
		let fullWord = [];

		letters.forEach((x,i) => {
			let wrapLetter = `<span>${x}</span>`;

			fullWord.push(wrapLetter);
		});

		fullWord = fullWord.join('');
		this.mainElement.innerHTML = fullWord;
	}

	randomNumberLogo() {
		return Math.floor(Math.random()*this.randomLogos.length);
	}

	addHoverEvents(_this) {
		var self = _this;

		self.changeLogoElements.forEach((x, i) => {
			let parent = x;
			let child = x.children;

			if ("ontouchstart" in document.documentElement === false) {
				x.addEventListener('mouseenter', function(e) {
					let dataLogo = this.dataset.changeLogo;

					self.changeLogo(dataLogo);
					self.morphing.toSquare(child[0]);
				});

				x.addEventListener('mouseout', (e) => {
					let dataLogo = self.mainElement.dataset.firstLogo;

					if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === 0) {
						self.changeLogo(dataLogo);
					} else if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === Number(document.querySelector('.js-change-logo.is-active').dataset.slideId)) {
						self.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
					} else if (document.querySelector('.js-change-logo.is-active').dataset.content === document.querySelector('.js-slide.is-active').dataset.content) {
						self.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
					}

					if (x.classList.contains('is-active')) {
						self.morphing.toTriangle(child[0]);
					} else {
						self.morphing.toCircle(child[0]);
					}
				});
			}
		});

		document.querySelector('.js-logotyper-changelogo').addEventListener('mouseenter', (e) => {
			let logoID = self.randomNumberLogo();
			self.changeLogo(logoID);
		});

		document.querySelector('.js-logotyper-changelogo').addEventListener('mouseout', (e) => {
			let dataLogo = self.mainElement.dataset.firstLogo;

			if (document.querySelector('.js-slide') !== null) {

				if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === 0) {
					self.changeLogo(dataLogo);
				} else if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === Number(document.querySelector('.js-change-logo.is-active').dataset.slideId)) {
					self.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
				} else if (document.querySelector('.js-change-logo.is-active').dataset.content === document.querySelector('.js-slide.is-active').dataset.content) {
					self.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
				}
			} else {
				self.changeLogo(dataLogo);
			}
		});
	}
}
