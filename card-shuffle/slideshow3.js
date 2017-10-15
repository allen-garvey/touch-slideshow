"use strict";

(function($){
    var DIRECTION_LEFT = 0;
    var DIRECTION_RIGHT = 1;
    var TOUCH_DRAG_THRESHOLD = 100; //number of pixels touch should be dragged before slide changes
    var ACTIVE_IMAGE_CLASS_NAME = 'active';
    
    var currentIndex = 0;
    var hasImageChanged = false;
    var touchStartXCoordinate = 0;
    
    var slideshowImages = $('#slideshow_image_container img');
    var NUM_SLIDESHOW_IMAGES = slideshowImages.length;
    
    function initialize(){
        //display first image on slideshow load
        if(NUM_SLIDESHOW_IMAGES > 0){
            slideshowImages[currentIndex].classList.add(ACTIVE_IMAGE_CLASS_NAME);
        }
    }
    
    function displayImage(index){
        slideshowImages[index].classList.add(ACTIVE_IMAGE_CLASS_NAME);
    }
    
    function hideImage(index){
        slideshowImages[index].classList.remove(ACTIVE_IMAGE_CLASS_NAME);
    }
    
    function shouldSlideImage(direction){
        if(direction === DIRECTION_RIGHT && currentIndex === NUM_SLIDESHOW_IMAGES - 1){
            return false;
        }
        if(direction === DIRECTION_LEFT && currentIndex === 0){
            return false;
        }
        
        return true;
    }
    
    function translateSlideshow(slideshowImage, translationPx){
        slideshowImage.style.transform = "translate(" + translationPx + "px, 0px)";
    }
    
    function slideImage(direction){
        if(!shouldSlideImage(direction)){
            return;
        }
        hasImageChanged = true;
        hideImage(currentIndex);
        slideshowImages[currentIndex].style.transform = '';
        
        if(direction === DIRECTION_LEFT){
            currentIndex--;
        }
        else{
            currentIndex++;
        }
        displayImage(currentIndex);
        
    }
    
    slideshowImages.on("touchstart", function(event) {
       touchStartXCoordinate = event.targetTouches[0].clientX;
    });
    
    slideshowImages.on("touchend", function(event){
        if(hasImageChanged){
            hasImageChanged = false;
        }
        else{
            translateSlideshow(slideshowImages[currentIndex], 0);    
        }
    });
    
    slideshowImages.on("touchmove", function(event) {
        if(hasImageChanged){
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
        var translationAmountBase = 0;
        var slideTranslation = translationAmountBase + coordinateDifference;
        
        translateSlideshow(slideshowImages[currentIndex], slideTranslation);
    });
    
    initialize();
})(aQuery);