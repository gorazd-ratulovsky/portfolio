// let type = "WebGL";
// if(!PIXI.utils.isWebGLSupported()){
// 	type = "canvas"
// }

// //Create a Pixi Application
// let app = new PIXI.Application({ 
//     width: 256,         // default: 800
//     height: 256,        // default: 600
//     antialias: true,    // default: false
//     transparent: false, // default: false
//     resolution: 1
//   }
// );

// //app.renderer.backgroundColor = 0x061639;
// document.querySelector('.js-test').onclick = function() {
// 	app.renderer.backgroundColor = 0x061639;
// }

// //Add the canvas that Pixi automatically created for you to the HTML document
// document.querySelector('.js-canvas').appendChild(app.view);

// PIXI.utils.sayHello(type);
"use strict";

class ScrollSlider {
	constructor(_slider, _slideElement) {
		var self = this; 
		this.logoTyper = new LogoTyper('.js-logotyper', '.js-change-logo');

		this.slider = _slider;
		this.slideElement = _slideElement;
		this.sliderElements = [];

		this.pushItems();

		// ADD EVENTS //
		this.addScrollEvent(self);
		this.addClickEvent(self);
	}

	// METHODS //
	pushItems() {
		let countItems = document.querySelectorAll(this.slideElement);
		
		countItems.forEach( (x, i) => {
			x.dataset.slideId = i;

			if (i === 0) {
				this.sliderElements.push({item: x, id: i, visible: true});
			} else {
				this.sliderElements.push({item: x, id: i, visible: false});
			}
		}, this);
	}

	setSlide(slideId) {
		let currentId = document.querySelector('.js-slide.is-active').dataset.slideId;
		let nextId;
		let prevId;

		// vracia true / false
		if (currentId < slideId) { //next
			nextId = slideId;

			let currentEl = this.sliderElements[currentId];
			let nextEl = this.sliderElements[nextId];

			currentEl.item.classList.remove('is-active');
			currentEl.item.classList.add('is-scrolling-down');
			nextEl.item.classList.add('is-scrolling-down--next');
			nextEl.item.classList.add('is-active');
			currentEl.visible = false;
			nextEl.visible = true;

			setTimeout(function() {
				currentEl.item.classList.remove('is-scrolling-down');
				currentEl.item.classList.remove('is-visible');

				nextEl.item.classList.remove('is-scrolling-down--next');
				nextEl.item.classList.add('is-visible');
			}, 1000);
			
		} 
		else if (currentId > slideId) { // prev
			prevId = slideId;

			let currentEl = this.sliderElements[currentId];
			let prevEl = this.sliderElements[prevId];

			currentEl.item.classList.add('is-scrolling-up');
			currentEl.item.classList.remove('is-active');
			prevEl.item.classList.add('is-scrolling-up--prev');
			prevEl.item.classList.add('is-active');
			currentEl.visible = false;
			prevEl.visible = true;

			setTimeout(function() {
				currentEl.item.classList.remove('is-scrolling-up');
				currentEl.item.classList.remove('is-visible');

				prevEl.item.classList.remove('is-scrolling-up--prev');
				prevEl.item.classList.add('is-visible');
			}, 1000);
		}

			if (document.querySelector('.js-slide.is-active').dataset.bg === 'blue') {
				document.querySelector('body').classList.add('is-blue');
			} else {
				document.querySelector('body').classList.remove('is-blue');
			}
		

		this.setNavigation(slideId);
	}

	setNavigation(id) {
		var previouseActive = document.querySelector('.js-slider-navItem.is-active');
		//let setLogo = document.querySelector('.js-change-logo.is-active').dataset.changeLogo;
		
		if(previouseActive) {
			previouseActive.classList.remove('is-active');
		}

		if (id !== 0) {
			document.querySelector(`.js-slider-navItem[data-slide-id="${id}"]`).classList.add('is-active');
			this.logoTyper.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
		} else {
			this.logoTyper.changeLogo(document.querySelector('.js-logotyper').dataset.firstLogo);
		}
	}

	addScrollEvent(_this) {
		var self = _this;
		// scroll event
		window.addEventListener('load', () => {
			var scrollStatus = {
				wheeling: false,
				functionCall: false
			};
			var scrollTimer = false;

			window.addEventListener('wheel', (e) => {
				scrollStatus.wheeling = true;
				if (!scrollStatus.functionCall) {

					if (e.deltaY < 0) { //up
						let current = Number(document.querySelector('.js-slide.is-active').dataset.slideId);
						let prev = current === 0 ? current : current - 1;

						self.setSlide(prev);
					}
					if (e.deltaY > 0) { //down
						let current = Number(document.querySelector('.js-slide.is-active').dataset.slideId);
						let next = current === self.sliderElements.length - 1 ? current : current + 1;

						self.setSlide(next);
					}
					scrollStatus.functionCall = true;
				}

				window.clearInterval(scrollTimer);
				scrollTimer = window.setTimeout(() => {
					scrollStatus.wheeling = false;
					scrollStatus.functionCall = false;
				}, 100); //set this millisecond to your liking
			});
		});
	}

	addClickEvent(_this) {
		var self = _this;

		// pager click event
		document.querySelectorAll('.js-slider-navItem').forEach( (x,i) => {
			x.addEventListener('click', function(e){
				e.preventDefault();

				let slideId = Number(this.dataset.slideId);
								
				self.setSlide(slideId);
			})
		});
	}
}

class LogoTyper {
	constructor(initElement, changeElement) {
		var self = this;

		this.mainElement = document.querySelector(initElement);
		this.randomLogos = ['gorazd—design', 'gorazd—interactive', 'gorazd—coding'];
		this.changeLogoElements = document.querySelectorAll(changeElement);

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
			x.addEventListener('mouseenter', function(e) {
				let dataLogo = this.dataset.changeLogo;

				self.changeLogo(dataLogo);
			});

			x.addEventListener('mouseout', (e) => {
				let dataLogo = self.mainElement.dataset.firstLogo;

				if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === 0) {
					self.changeLogo(dataLogo);
				} else if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === Number(document.querySelector('.js-change-logo.is-active').dataset.slideId)) {
					self.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
				} 

			});
		});

		document.querySelector('.js-logotyper-changelogo').addEventListener('mouseenter', (e) => {
			let logoID = self.randomNumberLogo();
			self.changeLogo(logoID);
		});

		document.querySelector('.js-logotyper-changelogo').addEventListener('mouseout', (e) => {
			let dataLogo = self.mainElement.dataset.firstLogo;

			if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === 0) {
				self.changeLogo(dataLogo);
			} else if (Number(document.querySelector('.js-slide.is-active').dataset.slideId) === Number(document.querySelector('.js-change-logo.is-active').dataset.slideId)) {
				self.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
			} 
			//self.changeLogo(logoID);
		});
	}
}

class Gallery {
	constructor() {

	}
}

const logo = new LogoTyper('.js-logotyper', '.js-change-logo');

const slider = new ScrollSlider('.js-slider', '.js-slide');

