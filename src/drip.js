define(function(require){
	'use strict';

	var prime = require('components/primish/prime'),
		options = require('components/primish/options'),
		emitter = require('components/primish/emitter'),
		requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	var Particle = prime({
		/**
		 * @constructor
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} vx
		 * @param {Number} vy
		 * @param {Number} s
		 */
		constructor: function(x, y, vx, vy, s){
			this.x = x;
			this.y = y;
			this.vx = vx;
			this.vy = vy;
			this.s = s;
		}
	});

	var particleText = prime({

		implement: [options, emitter],

		options: {
			GRAVITY: 100 / 1000,
			font: '96px \'Arial\'',
			fillStyle: 'White',
			text: ''
		},

		/**
		 * @constructor
		 * @param {Element] element, canvas element. needs width & height
		 * @param {Object} options, mixed in
		 */
		constructor: function(element, options){
			this.canvas = element;

			this.setOptions(options);

			this.particles = [];
			this.pixels = [];

			this.setElements();
			this.setText(this.options.text);
			this.trigger('ready');
			this.render();
		},

		setElements: function(){
			var canvas = this.canvas;

			this.context = canvas.getContext('2d');
			this.canvasW = canvas.width;
			this.canvasH = canvas.height;
			this.pixels = this.context.getImageData(0, 0, this.canvasW, this.canvasH);
			this.pl = this.pixels.data.length;
			this.data = this.pixels.data;
		},

		setText: function(str, font, fill){
			var dummy = document.createElement('canvas'),
				dummyContext;

			dummy.width = this.canvasW;
			dummy.height = this.canvasH;

			dummyContext = dummy.getContext('2d');
			dummyContext.font = font || this.options.font;
			dummyContext.fillStyle = fill || this.options.fillStyle;
			dummyContext.fillText(str, (this.canvasW - dummyContext.measureText(str).width) / 2, this.canvasH / 2);

			this.textPixels = dummyContext.getImageData(0, 0, this.canvasW, this.canvasH);
			dummy = dummyContext = null;

			return this;
		},

		render: function(){
			var i = 0,
				p,
				particles = this.particles,
				o = this.options,
				d;

			for (; i < particles.length; i++){
				p = particles[i];

				p.vy += o.GRAVITY * p.s;
				p.vx *= 0.99;
				p.vy *= 0.99;
				d = 1 - (this.getPixel(p.x, p.y).r / 0xff) * 0.6;
				p.vx *= d;
				p.vy *= d;
				p.x += p.vx;
				p.y += p.vy;

				this.setPixel(p.x, p.y, 255, 225, 255);

				if (p.y > this.canvasH)
					particles.splice(i, 1);
			}

			i = 3;
			while(i--)
				this.addParticle(Math.random() * this.canvasW, 0, Math.random() + 0.5);

			this.context.putImageData(this.pixels, 0, 0);
			this.fadeout();
			this.frame = requestAnimationFrame(this.render.bind(this));
		},

		stop: function(){
			cancelAnimationFrame(this.frame);
			delete this.frame;
		},

		addParticle: function(x, y, s){
			this.particles.push(new Particle(x, y, 0, 0, s, 0xFFFFFF));
		},

		setPixel: function(x, y, r, g, b){
			var idx,
				pixels = this.pixels;

			if (x >= 0 && x < this.canvasW && y >= 0 && y < this.canvasH){
				idx = ((x | 0) + (y | 0) * this.canvasW) * 4;
				pixels.data[idx + 0] = r;
				pixels.data[idx + 1] = g;
				pixels.data[idx + 2] = b;
				pixels.data[idx + 3] = 252;
			}
		},

		getPixel: function(x, y){
			var idx,
				ret = {
					r: 0,
					g: 0,
					b: 0
				}, pixels = this.textPixels;

			if (pixels && x >= 0 && x < this.canvasW && y >= 0 && y < this.canvasH){
				idx = ((x | 0) + (y | 0) * this.canvasW) * 4;
				ret.r = pixels.data[idx + 0];
				ret.g = pixels.data[idx + 1];
				ret.b = pixels.data[idx + 2];
			}
			return ret;
		},

		fadeout: function(){
			var i = 3,
				pixels = this.data,
				l = this.pl,
				a;

			for (; i < l; i += 4){
				a = pixels[i];
				if (a < 253){
					if (a < 36)
						pixels[i] = 0;
					else if (a < 66){
						pixels[i] *= 0.985;
					}
					else {
						pixels[i] *= 0.76;
					}
				}
			}
		}

	});


	return particleText;

});