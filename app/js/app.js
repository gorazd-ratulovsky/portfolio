"use strict";
import LoadContent from './components/LoadContent.js';
import ScrollSlider from './components/scrollSlider.js';
import Gallery from './components/gallery.js';
import NavMorphing from './components/navMorphing.js';
import LogoTyper from './components/logoTyper.js';
import ProjectCounter from './components/projectCounter.js';

//const ajaxContent = new LoadContent();
window.ProjectCounter = new ProjectCounter();

window.NavMorphing = new NavMorphing();

window.LogoTyper = new LogoTyper('.js-logotyper', '.js-change-logo');

window.ScrollSlider = new ScrollSlider('.js-slider', '.js-slide');

window.Gallery = new Gallery();








