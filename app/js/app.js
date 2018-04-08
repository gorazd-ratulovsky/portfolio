"use strict";
class LoadContent {
	constructor() {
		var self = this;

		//this.scrollSlider = new ScrollSlider('.js-slider', '.js-slide');

		let transEffect = Barba.BaseTransition.extend({
			start: function(){
				// console.log(this.oldContainer.classList.add('fade-out'));
				// console.log(this.newContainerLoading);
				Promise
					.all([this.newContainerLoading, this.fadeOut()])
					.then(this.fadeIn.bind(this));
			},
			fadeOut: function() {
				return this.oldContainer.classList.add('fade-out-section');
			},
			fadeIn: function() {
				var _this = this;
				var el = this.newContainer;

				el.classList.add('fade-in-section');

				setTimeout(function(){
					el.classList.remove('fade-in-section');
					_this.done();
				}, 1000);
			}
		});

		var homepage = Barba.BaseView.extend({
			namespace: 'homepage',
			onLeaveCompleted: function() {
				document.body.classList.add('is-subpage');
			}
		});

		var subpage = Barba.BaseView.extend({
			namespace: 'sub-page',

			onLeaveCompleted: function() {
				//self.scrollSlider.pushItems();
				document.body.classList.remove('is-subpage');
				document.body.classList.add('is-blue', 'is-home');
			}
		});

		homepage.init();
		subpage.init();

		Barba.Pjax.getTransition = function() {
			return transEffect;
		}

		Barba.Pjax.start();
	}

}


class ScrollSlider {
	constructor(_slider, _slideElement) {
		var self = this; 
		this.projectCounter = new ProjectCounter();
		this.logoTyper = new LogoTyper('.js-logotyper', '.js-change-logo');
		this.morphing = new NavMorphing();

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

	setSlide(slideId, content) {
		let currentId = document.querySelector('.js-slide.is-active').dataset.slideId;
		let nextId;
		let prevId;
		let currentDataContent = document.querySelector('.js-slide.is-active').dataset.content;

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

		setTimeout(function() {
			if (document.querySelector('.js-slide.is-active').dataset.bg === 'blue') {
				document.querySelector('body').classList.add('is-blue');
			} else {
				document.querySelector('body').classList.remove('is-blue');
			}
		}, 300);

		if (document.querySelector('.js-slide.is-active').dataset.content === 'projects') {
			let number = 2;
			this.projectCounter.toggleTemplate(true);
			this.projectCounter.updateNumber(slideId - number);
		} else {
			this.projectCounter.toggleTemplate(false);
		}

		if (document.querySelector('.js-slide.is-active').dataset.slideId === '0') {
			document.querySelector('body').classList.add('is-home');
		} else {
			document.querySelector('body').classList.remove('is-home');
		}
		

		this.setNavigation(slideId, content);
	}

	setNavigation(id, content) {
		var name = id === 0 ? document.querySelector(`.js-slide[data-slide-id="0"]`).dataset.content : content;
		var previouseActive = document.querySelector('.js-slider-navItem.is-active');
		let child = id !== 0 ? document.querySelector(`.js-slider-navItem[data-content="${name}"]`).children : document.querySelector(`.js-slider-navItem[data-slide-id="${id + 1}"]`).children;

		if(previouseActive) {
			previouseActive.classList.remove('is-active');
			this.morphing.toCircle(previouseActive.children[0]);
		}

		if (name !== 'home') {
			document.querySelector(`.js-slider-navItem[data-content="${name}"]`).classList.add('is-active');
			this.logoTyper.changeLogo(document.querySelector('.js-change-logo.is-active').dataset.changeLogo);
			this.morphing.toTriangle(child[0]);
			
		} else if (name === 'home') {
			document.querySelector(`.js-slider-navItem[data-slide-id="${id + 1}"]`).classList.remove('is-active');
			this.logoTyper.changeLogo(document.querySelector('.js-logotyper').dataset.firstLogo);
			this.morphing.toCircle(child[0]);
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

			if (document.querySelector('.js-slide') !== null) {
				window.addEventListener('wheel', (e) => {
					scrollStatus.wheeling = true;
					if (!scrollStatus.functionCall) {

						if (e.deltaY < 0) { //up
							let current = Number(document.querySelector('.js-slide.is-active').dataset.slideId);
							let prev = current === 0 ? current : current - 1;
							let prevContent = document.querySelector(`.js-slide[data-slide-id="${prev}"]`).dataset.content;

							self.setSlide(prev, prevContent);
						}
						if (e.deltaY > 0) { //down
							let current = Number(document.querySelector('.js-slide.is-active').dataset.slideId);
							let next = current === self.sliderElements.length - 1 ? current : current + 1;
							let nextContent = document.querySelector(`.js-slide[data-slide-id="${next}"]`).dataset.content;

							self.setSlide(next, nextContent);
						}
						scrollStatus.functionCall = true;
					}

					window.clearInterval(scrollTimer);
					scrollTimer = window.setTimeout(() => {
						scrollStatus.wheeling = false;
						scrollStatus.functionCall = false;
					}, 200); //set this millisecond to your liking
				});
			}
		});
	}

	addClickEvent(_this) {
		var self = _this;

		// pager click event
		document.querySelectorAll('.js-slider-navItem').forEach( (x,i) => {
			x.addEventListener('click', function(e){
				e.preventDefault();
				e.stopPropagation();

				let slideId = Number(this.dataset.slideId);
				let content = this.dataset.content;

				self.setSlide(slideId, content);
			})
		});
	}
}

class LogoTyper {
	constructor(initElement, changeElement) {
		var self = this;
		this.morphing = new NavMorphing();

		this.mainElement = document.querySelector(initElement);
		this.randomLogos = ['gorazd—design', 'gorazd—interactive', 'gorazd—coding', 'gorazd—digital'];
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
			let parent = x;
			let child = x.children;

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
				} 

				if (x.classList.contains('is-active')) {
					self.morphing.toTriangle(child[0]);
				} else {
					self.morphing.toCircle(child[0]);
				}
			});
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
				} 
			} else {
				self.changeLogo(dataLogo);
			}
		});
	}
}

class Gallery {
	constructor() {
		this.init();
	}

	init() {
		let galleries = document.querySelectorAll('.js-project-gallery');

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

class NavMorphing {
	constructor(element) {
		var self = this;

		this.svg;
		this.s;

		this.triangle;
		this.square;
		this.circle;

		this.trianglePoints = 'M3.27,9l10-5.5v11Z';
		this.squarePoints = 'M4.5,4.5h9v9h-9Z';
		this.circlePoints = 'M4.5,9A4.5,4.5,0,1,1,9,13.5,4.5,4.5,0,0,1,4.5,9Z';
	}

	init(el) {
		this.svg = el;
		this.s = Snap(this.svg);

		this.triangle = Snap.select('#' + el.getAttribute('id') +  ' .triangle');
		this.square = Snap.select('#' + el.getAttribute('id') +  ' .square');
		this.circle = Snap.select('#' + el.getAttribute('id') +  ' .circle');
	}


	toSquare(el) {
		this.init(el);

		this.circle.animate({ d: this.squarePoints }, 500, mina.backout);  
	}

	toCircle(el) {
		this.init(el);
		this.circle.animate({ d: this.circlePoints }, 500, mina.backout); 
	}

	toTriangle(el) {
		this.init(el);
		this.circle.animate({ d: this.trianglePoints }, 500, mina.backout); 
	}
}

class ProjectCounter {
	constructor() {
		this.projects = document.querySelectorAll('.js-slide[data-project-id]');
		this.projectsId = [];

		this.init();
		this.template();
	}

	init() {
		this.projects.forEach((x,i) => {
			let id = x.dataset.projectId;
			this.projectsId.push(id);
		});
	}

	template() {
		document.querySelector('.l-header').innerHTML += `<div class='l-header__projects js-projects-tmpl'>[<span class="js-current-project">${this.projectsId[0]}</span> / ${this.projectsId[this.projects.length - 1]}]</div>`;
	}

	toggleTemplate(boolean) {
		if (boolean) {
			document.querySelector('.js-projects-tmpl').classList.add('is-active');
		} else {
			document.querySelector('.js-projects-tmpl').classList.remove('is-active');
		}
	}

	updateNumber(id) {
		document.querySelector('.js-current-project').innerHTML = this.projectsId[id];
	}

}
//const ajaxContent = new LoadContent();

const logoTyper = new LogoTyper('.js-logotyper', '.js-change-logo');

const slider = new ScrollSlider('.js-slider', '.js-slide');

const gallery = new Gallery();








