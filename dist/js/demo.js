define(function(require){
	'use strict';

	var particleText = require('../../src/freezer');

	var pt = new particleText(document.getElementById('freezer'), {
		text: 'CODE FREEZE'
	});

	document.getElementById('setter').addEventListener('change', function(){
		pt.setText(this.value.toUpperCase());
	}, false);

	document.getElementById('stop').addEventListener('click', function(){
		var method = pt.frame ? 'stop' : 'render',
			text = pt.frame ? 'start' : 'stop';

		pt[method]();
		this.innerHTML = text;
	}, false);

});