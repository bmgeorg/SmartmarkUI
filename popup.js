$(function() {
    $("#config_expand_button").click(function() {
        // Eventually may change this to slideToggle(), but that's laggy right now
        // Making elements fixed-width may help, but that stiffens the design too much right now
        $("#config_block").toggle();
    });
});
