"use strict";

export default class NavMorphing {
	constructor() {
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

		this.circle.animate({ d: this.squarePoints }, 1000, mina.backout);  
	}

	toCircle(el) {
		this.init(el);
		this.circle.animate({ d: this.circlePoints }, 1000, mina.backout); 
	}

	toTriangle(el) {
		this.init(el);
		this.circle.animate({ d: this.trianglePoints }, 1000, mina.backout); 
	}
}

