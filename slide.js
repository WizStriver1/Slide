/**
 * 轮播图
 * @param  {string} plug    			Slider
 * @return {object} options       调整内置参数
 * options内部参数
 * @param  {int} current    传递的参数
 * @param  {int} staytime 	自动轮播时，默认停留时间为5s
 * @param  {bool} hoverstop 鼠标悬停时默认不停止轮播
 * @param  {bool} auto 			默认自动轮播
 */
(function(root, factory, plug) {
	factory(root.jQuery, plug);
})(window, function($, plug) {
	var _OPTIONS_ = {
		current: 1,
		staytime: 5000,
		thetime: null,
		sliding: false,
		hoverstop: false,
		auto: true,
		animate: {
			speed: '600',
			easing: 'linear',
			fn: function() {
				this.autoslide();
				this.resetCurrent();
				this.sliding = false;
			}
		}
	};
	var _TOOLS_ = {
		init: function() {
			this.getEle();
			this.setItemsWidth();
			this.cloneItems();
			this.setInnerWidth();
			this.autoslide();
			this.slide8btn();
			this.hoverstop && this.sethoverstop();
		},
		getEle: function() {
			this.inner = this.find('.slider-inner');
			this.items = this.inner.find('.item');
			this.dots = this.find('.slider-dot .dot-item').each(function(i, ele) {
				$(ele).data('index', i);
			});
			this.dots.eq(0).addClass('on');
			this.rarrow = this.find('.right-arrow');
			this.larrow = this.find('.left-arrow');
		},
		setItemsWidth: function() {
			this.items.width(this.items.width());
		},
		cloneItems: function() {
			var firstItem = this.items.eq(0).clone(true);
			var lastItem = this.items.eq(this.items.length - 1).clone(true);
			this.items.eq(0).before(lastItem);
			firstItem.appendTo(this.items.parent());
		},
		setInnerWidth: function() {
			var innerWidth = 0;
			this.items = this.inner.find('.item');
			if(!this.items.length) {
				return;
			}
			this.itemsWidth = this.items[0].offsetWidth;
			innerWidth = this.itemsWidth * this.items.length;
			this.inner.css('left', -1 * this.itemsWidth).width(innerWidth);
		},
		autoslide: function() {
			var _this = this;
			if(this.auto == false) {
				return false;
			}
			this.thetime = setTimeout(function() {
				_this.current ++;
				_this.animateitems();
			}, this.staytime);
		},
		animateitems: function() {
			this.sliding = true;
			this.lightenDots();
			this.inner.animate({'left': -1 * this.current * this.itemsWidth}, this.animate.speed, this.animate.easing, this.animate.fn.bind(this));
			clearTimeout(this.thetime);
		},
		lightenDots: function() {
			var dot = this.current - 1;
			if(this.current >= this.inner.find('.item').length - 1) {
				dot = 0;
			}
			if(this.current <= 0) {
				dot = this.inner.find('.item').length - 3;
			}
			this.dots.removeClass('on').eq(dot).addClass('on');
		},
		resetCurrent: function() {
			if(this.current >= this.inner.find('.item').length - 1) {
				this.current = 1;
				this.inner.css('left', -1 * this.itemsWidth);
			}
			if(this.current <= 0) {
				this.current = this.inner.find('.item').length - 2;
				this.inner.css('left', -1 * this.current * this.itemsWidth);
			}
		},
		slide8btn: function() {
			var _this = this;
			this.dots.on('click', function(event) {
				if(_this.sliding) {
					return
				}
				_this.current = $(this).data('index') + 1;
				_this.animateitems();
				event.stopPropagation();
			});
			this.rarrow.on('click', function(event) {
				if(_this.sliding) {
					return
				}
				_this.current ++;
				_this.animateitems();
				event.stopPropagation();
			});
			this.larrow.on('click', function(event) {
				if(_this.sliding) {
					return
				}
				_this.current --;
				_this.animateitems();
				event.stopPropagation();
			});
		},
		sethoverstop: function() {
			var _this = this;
			this.on('mouseover', function(event) {
				clearTimeout(_this.thetime);
			});
			this.on('mouseout', function(event) {
				_this.autoslide();
			});
		}
	};
	$.fn[plug] = function(options) {
		$.extend(this, _OPTIONS_, _TOOLS_, options);
		this.init();
		return this;
	}
}, 'Slider');