"use strict";

(function(){
    var IMAGE_WIDTH = 400;
    var IMAGE_MARGIN = 40;
    var DIRECTION_LEFT = 0;
    var DIRECTION_RIGHT = 1;
    //number of pixels touch should be dragged before slide changes
    var TOUCH_DRAG_THRESHOLD = 120;
    
    var currentIndex = 0;
    var isAnimating = false;
    var touchStartXCoordinate = 0;
    
    var slideshowImageContainer = document.getElementById('slideshow_image_container');
    var NUM_SLIDESHOW_IMAGES = document.querySelectorAll('#slideshow_image_container img').length;
    
    function shouldSlideImage(direction){
        if(isAnimating){
            return false;
        }
        if(direction === DIRECTION_RIGHT && currentIndex === NUM_SLIDESHOW_IMAGES - 1){
            return false;
        }
        if(direction === DIRECTION_LEFT && currentIndex === 0){
            return false;
        }
        
        return true;
    }
    
    function translationAmountForImageIndex(imageIndex){
        var translationAmountDirectionMultiplier = -1;
        return imageIndex * (IMAGE_WIDTH + IMAGE_MARGIN) * translationAmountDirectionMultiplier;
    }
    
    function translateSlideshow(translationPx){
        slideshowImageContainer.style.transform = "translate(" + translationPx + "px, 0px)";
    }
    
    function slideImage(direction){
        if(!shouldSlideImage(direction)){
            return;
        }
        
        isAnimating = true;
        slideshowImageContainer.classList.add('animated');
        
        if(direction === DIRECTION_LEFT){
            currentIndex--;
        }
        else{
            currentIndex++;
        }
        
        var translationAmount = translationAmountForImageIndex(currentIndex);
        translateSlideshow(translationAmount);
    }
    
    //onclick handler
    slideshowImageContainer.onclick = function(){
        //slideImage(DIRECTION_RIGHT);
    };
    
    //on animation end handler
    slideshowImageContainer.addEventListener("transitionend", function(event) {
        slideshowImageContainer.classList.remove('animated');
        isAnimating = false;
    });
    
    slideshowImageContainer.addEventListener("touchstart", function(event) {
       //console.log(event);
       touchStartXCoordinate = event.targetTouches[0].clientX;
       //console.log(touchStartXCoordinate);
    });
    
    slideshowImageContainer.addEventListener("touchmove", function(event) {
        if(isAnimating){
            return;
        }
        var currentXCoordinate = event.targetTouches[0].clientX;
        var coordinateDifference = currentXCoordinate - touchStartXCoordinate;
        
        var direction = DIRECTION_RIGHT;
        if(coordinateDifference > 0){
            direction = DIRECTION_LEFT;
        }
        if(Math.abs(coordinateDifference) >= TOUCH_DRAG_THRESHOLD){
            slideImage(direction);
            return;
        }
        //don't move image if on the end of the slideshow and
        //direction is towards non-existence image
        if(!shouldSlideImage(direction)){
            return;
        }
        var translationAmountBase = translationAmountForImageIndex(currentIndex);
        var slideTranslation = translationAmountBase + coordinateDifference;
        
        translateSlideshow(slideTranslation);
    });
    
})();