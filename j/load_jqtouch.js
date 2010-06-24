;(function ($, unknown) {
    jQT = new $.jQTouch({
        icon: 'i/icon.png',
        statusBar: 'black-translucent',
        touchSelector: '.board .intersection, .board, .touch'
    });
    jQT.addAnimation({
        name: 'slideback',
        selector: '.slideback'
    });
})(jQuery);