/*
	Copyright (c) 2011 Oscar Godson (@oscargodson), City of Portland, OR
	
	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:
	
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
*/

;(function($){
  $.fn.pdxfade = function(options) {
		var settings = $.extend({}, $.fn.pdxfade.defaultOptions, options);
		var classNames = {
			activeSlide:settings.classNamespace+'-active-slide',
			slideshowWrapper:settings.classNamespace+'-slideshow-wrapper',
			nextButton:settings.classNamespace+'-next',
			previousButton:settings.classNamespace+'-previous',
			overlay:settings.classNamespace+'-overlay',
			overlayInner:settings.classNamespace+'-overlay-inner'
		};
		return this.each(function() {
			var $this = $(this)
			,		timer
			,		api = {
						go: function(dir){
							dir = dir || 'next';
							if($this.find(':animated').length < 1){
								window.clearInterval(timer);
							
								var currentSlide = $this.find('.'+classNames.activeSlide)
								,		updateText = function(){
											var overlay = $this.parent().find('.'+classNames.overlay);
											if($this.find('.'+classNames.activeSlide+' '+settings.titleTag).length > 0 || $this.find('.'+classNames.activeSlide+' '+settings.descriptionTag).length > 0){
												overlay.animate({bottom:'0px'},150);
												api.updateText($this.find('.'+classNames.activeSlide+' '+settings.titleTag).text(),$this.find('.'+classNames.activeSlide+' '+settings.descriptionTag).html());
											}
											else{
												overlay.animate({bottom:'-'+overlay.outerHeight()+'px'},150);
											}
										}
								
								
								currentSlide.fadeOut(settings.animationTime).removeClass(classNames.activeSlide);
								console.log(currentSlide.attr('style'));
								if(dir == 'next'){
									if(currentSlide.next().length > 0){
										currentSlide.next().fadeIn(settings.animationTime).addClass(classNames.activeSlide);
									}
									else{
										$this.find('li:first').fadeIn(settings.animationTime).addClass(classNames.activeSlide);
									}
								}
								
								else if(dir == 'prev' || dir == 'previous'){
									if(currentSlide.prev().length > 0){
										currentSlide.prev().fadeIn(settings.animationTime).addClass(classNames.activeSlide);
									}
									else{
										$this.find('li:last').fadeIn(settings.animationTime).addClass(classNames.activeSlide);
									}
								}
								
								updateText();
								
								timer = window.setInterval(function(){ api.next(); },settings.animationTime+settings.delayTime);
							}
							
							return this;
							
						},
						
						//Just a shortcut to api.go('next');
						next: function(){ api.go('next'); return this; },
						
						//Just a shortcut to api.go('prev') or api.go('previous');
						prev: function(){ api.go('prev'); return this; },
						
						updateText: function(title,description){
							title = title || '';
							description = description || '';
							$this.parent().find('.'+classNames.overlay+' '+settings.titleTag).text(title);
							$this.parent().find('.'+classNames.overlay+' '+settings.descriptionTag).html(description);
							return this;
						}
					};
			
			timer = window.setInterval(function(){ api.next(); },settings.animationTime+settings.delayTime)
			
			$this.css({margin:'0',padding:'0',listStyle:'none'}).find('li').css('display','block');
			
			$this.find('img')
				//Forces no caching on images so we can check when they are really loaded
				.each(function(){
						$(this).attr('src',$(this).attr('src')+'?rand='+Math.round(Math.random()*10001));
				});			
			
			$this.find('li:first').addClass(classNames.activeSlide);
			$this.find('li:not(:first)').css('display','none');
			
			$this.find('img:first').load(function(){
				
				$this.wrap('<div class="'+classNames.slideshowWrapper+'"></div>')
				.parent('.'+classNames.slideshowWrapper)
				.css({position:'relative',width:$(this).outerWidth()+'px',height:$(this).outerHeight()+'px',overflow:'hidden'})
				.append('<img class="'+classNames.previousButton+'" src="left-arrow-'+settings.arrowColor+'.png" title="Previous Slide"><img class="'+classNames.nextButton+'" src="right-arrow-'+settings.arrowColor+'.png" title="Next Slide"><div class="'+classNames.overlay+'"><div class="'+classNames.overlayInner+'"><'+settings.titleTag+'></'+settings.titleTag+'><'+settings.descriptionTag+'></'+settings.descriptionTag+'></div></div>')
					.find('.'+classNames.previousButton+',.'+classNames.nextButton).load(function(){
						$(this).css({
							top:$this.find('img:first').outerHeight()/2-$(this).outerHeight()/2+'px',
							position:'absolute',
							cursor:'pointer'
						}).fadeTo(0,0.5);
					})
					.filter('.'+classNames.previousButton).css({left:'10px'})
						.click(function(){ api.prev(); })
						.end()
					.filter('.'+classNames.nextButton).css({right:'10px'})
						.click(function(){ api.next(); });
					
				$this.parent()
					.find('.'+classNames.overlay)
						.css({
							position:'absolute',
							bottom:'0',
							width:'100%',
							background:'#000',
							opacity:'0.8',
							filter:'alpha(opacity=80)'
						})
							.find('.'+classNames.overlayInner)
								.css({
									padding:'10px'
								});
				
				api.updateText($this.find('li:first '+settings.titleTag).text(),$this.find('li:first '+settings.descriptionTag).html())
				
				//Make things fade in and out on mouseenter/leave (like arrows)
				$this.parent().bind('mouseenter mouseleave',function(e){
						var arrows = $('.'+classNames.previousButton+',.'+classNames.nextButton)
						,		to = 0.9;
						if(e.type == 'mouseleave'){ to = 0.5; }
						arrows.stop(false,false).fadeTo(250,to);
				});
				
				//Default styles for the slideshow wrapper
				$this.parent(classNames.slideshowWrapper).css({height:$(this).outerHeight()+'px'});
			
				//Default styles for the uls,ols, lis, and imgs
				$this.find('li').css({margin:'0',padding:'0',listStyle:'none', position:'absolute'});
				
			});
			
		});
	};

	$.fn.pdxfade.defaultOptions = {
		animationTime:500,
		delayTime:5000,
		width:'auto',
		height:'auto',
		classNamespace:'pdxfade',
		titleTag: 'h2',
		descriptionTag:'p',
		arrowColor:'white' //can be white or black
	};
})(jQuery);