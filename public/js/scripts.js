/*$(window).load(function() {


});*/

$(function(){	
	
    $('.js-pex-box').on('click', function(){
        var self = $(this);
        self.toggleClass('active');
    });

    $('.js-pex-box').on('mouseleave', function(){
        var self = $(this);
        self.removeClass('active');
    });

});
