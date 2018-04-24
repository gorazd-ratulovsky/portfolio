"use strict";

export default class LoadContent {
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