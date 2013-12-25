define(function(require){
	'use strict';

	var primish = require('components/primish/primish'),
		options = require('components/primish/options'),
		emitter = require('components/primish/emitter'),
		requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
		cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	var Particle = primish({
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

	var particleText = primish({

		implement: [options, emitter],

		options: {
			// affects speed of drip on letters
			gravity: 70 / 1000,
			dripSpeed: 0.5,
			// overall particle strength
			strength: 15,
			// font settings
			fontSize: 96,
			fontFamily: 'Arial',
			// starting text
			text: '',
			colourMap: {
				// drop colours
				0: [200,200,200],
				// over text colours
				1: [240,240,255]
			}
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
			delete this.options.text;

			this.trigger('ready');
			this.start();
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

		setFont: function(size, family){
			size || (size = this.options.fontSize);
			family || (family = this.options.fontFamily);
			return [size, 'px', ' "', family, '"'].join('');
		},

		setText: function(str, fontSize, fontFamily){
			var dummy = document.createElement('canvas'),
				dummyContext;

			dummy.width = this.canvasW;
			dummy.height = this.canvasH;

			dummyContext = dummy.getContext('2d');

			fontSize || (fontSize = this.options.fontSize);
			dummyContext.font = this.setFont(fontSize, fontFamily);
			dummyContext.fillStyle = 'White';
			dummyContext.fillText(str, (this.canvasW - dummyContext.measureText(str).width) / 2, (this.canvasH + fontSize / 2) / 2);

			this.textPixels = dummyContext.getImageData(0, 0, this.canvasW, this.canvasH);
			dummy = dummyContext = null;

			return this;
		},

		render: function(){
			var i = 0,
				p,
				particles = this.particles,
				o = this.options,
				d,
				isText,
				rgb;

			for (; i < particles.length; i++){
				p = particles[i];
				rgb = o.colourMap[isText = this.isPixelOverText(p.x, p.y)];
				d = 1 - isText * o.dripSpeed;
				p.vy += o.gravity * p.s;
				p.vx *= 0.99;
				p.vy *= 0.99;
				p.vx *= d;
				p.vy *= d;
				p.x += p.vx;
				p.y += p.vy;

				this.setPixel(p.x, p.y, rgb, i < 96 ? 251 - i : 96);

				if (p.y > this.canvasH)
					particles.splice(i, 1);
			}

			i = o.strength;
			while(i--)
				this.addParticle(Math.random() * this.canvasW, 0, Math.random() + 0.5);

			this.context.putImageData(this.pixels, 0, 0);
			this.fadeout();
			this.frame = requestAnimationFrame(this.boundRender);
		},

		start: function(){
			this.boundRender = this.render.bind(this);
			this.render();
			return this.trigger('start');
		},

		stop: function(){
			cancelAnimationFrame(this.frame);
			delete this.frame, this.boundRender;
			return this.trigger('stop');
		},

		addParticle: function(x, y, s){
			this.particles.push(new Particle(x, y, 0, 0, s, 0xFFFFFF));
		},

		setPixel: function(x, y, rgb, o){
			var idx,
				pixels = this.pixels;

			if (x >= 0 && x < this.canvasW && y >= 0 && y < this.canvasH){
				idx = ((x << 0) + (y << 0) * this.canvasW) * 4;
				pixels.data[idx++] = rgb[0];
				pixels.data[idx++] = rgb[1];
				pixels.data[idx++] = rgb[2];
				pixels.data[idx++] = o;
			}
		},

		isPixelOverText: function(x, y){
			var idx,
				ret = 0,
				pixels = this.textPixels;

			if (x >= 0 && x < this.canvasW && y >= 0 && y < this.canvasH){
				idx = ((x << 0) + (y << 0) * this.canvasW) * 4;
				ret = +(pixels.data[idx] / 255 === 1);
			}
			return ret;
		},

		fadeout: function(){
			var i = 3,
				pixelsData = this.data,
				l = this.pl,
				a;

			for (; i < l; i += 4){
				a = pixelsData[i];
				if (a < 255){
					if (a < 36)
						pixelsData[i] = 0;
					else if (a < 66){
						pixelsData[i] *= 0.785;
					}
					else {
						pixelsData[i] *= 0.96;
					}
				}
			}
		}

	});


	return particleText;

});