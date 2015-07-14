// leanModal v1.1 by Ray Stone - http://finelysliced.com.au
// Dual licensed under the MIT and GPL

(function($) {
    $.fn.extend({
        leanModal: function(options) {
            var defaults = {
                overlay: 0.5,
                closeButton: null
            };
            options = $.extend(defaults, options);
            return this.each(function() {
                var o = options;
                $(this).click(function(e) {
                    var modal_id = $(this).attr("href");
                    $("#lean_overlay").click(function() {
                        close_modal(modal_id)
                    });
                    $(o.closeButton).click(function() {
                        close_modal(modal_id)
                    });
                    $("#lean_overlay").css({
                        "display": "block",
                        opacity: 0,
                    });
                    $("#lean_overlay").fadeTo(200, o.overlay);
                    $(modal_id).css({
                        "display": "block",
                        "position": "fixed",
                        "opacity": 0,
                        "z-index": 1000,
                        "top": "50%",
                        "left": "50%",
                        "transform": "translate(-50%, -50%)",
                    });
                    $(modal_id).fadeTo(200, 1);
                    e.preventDefault()
                })
            });

            function close_modal(modal_id) {
                $("#lean_overlay").fadeOut(200);
                $(modal_id).css({
                    "display": "none"
                })
            }
        }
    })
})(jQuery);
