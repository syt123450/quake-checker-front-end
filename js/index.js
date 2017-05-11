/**
 * Created by ss on 2017/4/7.
 */

$(function() {

    if (document.body.clientWidth < 400) {
        $("aside").hide();
        $("#language").hide();
        $("#smallIcon").show();
        relocatedCameraForMobile();
        buildEnvironment(window.innerWidth, window.innerHeight);
    } else {
        buildEnvironment(window.innerWidth * 0.8, window.innerHeight);
    }

    $("#smallIcon").click(function() {
        $("#hideNav").show();
        $("#curtain").show();
    });

    $("#curtain").click(function() {
        $("#hideNav").hide();
        $("#curtain").hide();
    });
});

String.prototype.format = function () {
    var args = [].slice.call(arguments);
    return this.replace(/(\{\d+\})/g, function (a) {
        return args[+(a.substr(1, a.length - 2)) || 0];
    });
};