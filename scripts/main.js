
define('main', ['game'], function(game) {

	function callPhysics() {
		wrapInCanvas();
		game.init();
	}

	function wrapInCanvas() {
		var page = document.getElementById('page'), canvas;
		page.insertAdjacentHTML('beforebegin', '<canvas id="canvas-page" width=100% height=100%></canvas>');
		canvas = document.getElementById('canvas-page');
		canvas.appendChild(page);
	};
	function bindEvents() {
		var button = document.getElementById('fall-down');
		button.addEventListener('click', callPhysics);
	}
	bindEvents();
});