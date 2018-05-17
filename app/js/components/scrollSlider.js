"use strict";

export default class ScrollSlider {
	constructor(_slider, _slideElement) {
		var self = this; 
		this.projectCounter = window.ProjectCounter;
		this.logoTyper = window.LogoTyper;
		this.morphing = window.NavMorphing;

		this.slider = _slider;
		this.slideElement = _slideElement;
		this.sliderElements = [];

		this.pushItems();

		// ADD EVENTS //
		this.addTouchEvent(self);
		this.onLoadEvent(self);
		this.addScrollEvent(self);
		this.addClickEvent(self);

	}

	// METHODS //
	pushItems() {
		let countItems = Array.prototype.slice.call(document.querySelectorAll(this.slideElement));
		
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
		this.setHash(slideId, content);
	}

	setHash(_slideId, _hash) {
		var hash = `#${_hash}`;
		var url = location.origin + location.pathname + hash;

		if (_hash == 'projects') {
			var slideProjects = document.querySelector(`.js-slide[data-slide-id="${_slideId}"]`).dataset.projectId;
			window.location.replace(url + ':' + slideProjects);
		} else {
			window.location.replace(url);
		}
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

	toggleSlides(direction) {
		let current = Number(document.querySelector('.js-slide.is-active').dataset.slideId);
		let prev = current === 0 ? current : current - 1;
		let prevContent = document.querySelector(`.js-slide[data-slide-id="${prev}"]`).dataset.content;
		let next = current === this.sliderElements.length - 1 ? current : current + 1;
		let nextContent = document.querySelector(`.js-slide[data-slide-id="${next}"]`).dataset.content;

		if (direction === "up") {
			this.setSlide(prev, prevContent);
		} else if (direction === "down") {
			this.setSlide(next, nextContent);
		}
	}

	onLoadEvent(_this) {
		var self = _this;

		let hashArray = window.location.hash.split(/#|:/);
		let hash = hashArray[1];
		let slideArray;
		let slideId;
		let slideContent;

		if (hash != undefined) {
			slideArray = hash == 'projects' ? Array.prototype.slice.call(document.querySelectorAll(`${self.slideElement}[data-project-id="${hashArray[2]}"]`)) : Array.prototype.slice.call(document.querySelectorAll(`${self.slideElement}[data-content="${hash}"]`));
			slideId = Number(slideArray[0].dataset.slideId);
			slideContent = slideArray[0].dataset.content;

			self.setSlide(slideId, slideContent);
		}
	}

	addTouchEvent(_this) {
		var self = _this;

		let startY;
		let endY;

		document.addEventListener('touchstart', function(e){
			startY = e.pageY;
		});

		document.addEventListener('touchend', function(e){
			endY = e.pageY;
			if (startY > endY) {
				self.toggleSlides("down");
			} else if (startY < endY) {
				self.toggleSlides("up");
			}
		});
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

				if (window.addEventListener) {
					// IE9, Chrome, Safari, Opera
					window.addEventListener("mousewheel", MouseWheelHandler, false);
					// Firefox
					window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
				}
				// IE 6/7/8
				else window.attachEvent("onmousewheel", MouseWheelHandler);

				function MouseWheelHandler(e) {
					scrollStatus.wheeling = true;
					// cross-browser wheel delta
					var e = window.event || e; // old IE support
					var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
					
					if (!scrollStatus.functionCall) {
						if (delta > 0) { // up
							self.toggleSlides("up");
						} else if (delta < 0) { // down
							self.toggleSlides("down");
						}
						scrollStatus.functionCall = true;
					}

					window.clearInterval(scrollTimer);
					scrollTimer = window.setTimeout(() => {
						scrollStatus.wheeling = false;
						scrollStatus.functionCall = false;
					}, 200); //set this millisecond to your liking

					return false;
				}
			}
		});
	}

	addClickEvent(_this) {
		var self = _this;

		// pager click event
		Array.prototype.slice.call(document.querySelectorAll('.js-slider-navItem')).forEach( (x,i) => {
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


