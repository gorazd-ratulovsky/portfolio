"use strict";

export default class ProjectCounter {
	constructor() {
		var self = this;
		this.projects = Array.prototype.slice.call(document.querySelectorAll('.js-slide[data-project-id]'));
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