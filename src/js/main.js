window.hashCode = function(s){
    let res = s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);

    if(res < 0){
        res = res * (-1);
    }

    return res;
};


/**
 * Open modal window
 */
window.openModal = function () {
    if (modal !== null) {
        modal.style.display = 'block';
    }
};

/**
 * Close modal window
 */
window.closeModal = function () {
    if (modal !== null) {
        modal.style.display = 'none';
    }
};

/**
 * Show lightbox
 */
window.showLightbox = function () {
    if (lightbox !== null) {
        lightbox.style.display = 'block';
    }
};

/**
 * Hide lightbox
 */
window.hideLightbox = function () {
    if (lightbox !== null) {
        lightbox.style.display = 'none';
    }
};

if (lightbox !== null) {
    /**
     *
     */
    lightbox.addEventListener('click', function (event) {
       closeModal();
       hideLightbox();
    });
}


if (closeModalButton !== null) {
    /**
     *
     */
    closeModalButton.addEventListener('click', function (event) {
        closeModal();
        hideLightbox();
    });
}
