/**
 * Created by ss on 2017/4/7.
 */

$(function() {

    language = "english";
    setText();

    if (document.body.clientWidth < 400) {
        $("#language").hide();
        $("#smallIcon").show();
        bindSmallEvent();
        relocatedCameraForMobile();
        buildEnvironment(window.innerWidth, window.innerHeight, test_data());
    } else {
        $("aside").show();
        $("#language").show();
        bindEvent();
        buildEnvironment(window.innerWidth * 0.8, window.innerHeight, test_data());
    }

    $("#language select").on("change", function () {
        language = $(this).val();
        setText();
    });

    $("#hideNav select").on("change", function() {
        language = $(this).val();
        setText();
        $("#hideNav").hide();
        $("#curtain").hide();
    });

});

function bindEvent() {
    $("#button1").click(function() {
       $("#modal2").hide();
       $("#modal3").hide();
    });

    $("#button2").click(function() {
        $("#modal").hide();
        $("#modal3").hide();
    });

    $("#button3").click(function() {
        $("#modal").hide();
        $("#modal2").hide();
    });
}

function bindSmallEvent() {
    $("#smallIcon").click(function() {
        $("#hideNav").slideDown();
        $("#curtain").show();
    });

    $("#curtain").click(function() {
        $("#hideNav").hide();
        $("#curtain").hide();
    });

    $("#smallButton1").click(function() {
        $("#hideNav").hide();
        $("#curtain").hide();
    });

    $("#smallButton2").click(function() {
        $("#hideNav").hide();
        $("#curtain").hide();
    });

    $("#smallButton3").click(function() {
        $("#hideNav").hide();
        $("#curtain").hide();
    });
}

String.prototype.format = function () {
    var args = [].slice.call(arguments);
    return this.replace(/(\{\d+\})/g, function (a) {
        return args[+(a.substr(1, a.length - 2)) || 0];
    });
};

////////////------------ generate test data -----------
var latGen = function () {
    return Math.random() * 180 - 90;
};
var lngGen = function () {
    return Math.random() * 360 - 180;
};
var magGen = function () {
    return Math.random() * 9;
};
var depGen = function () {
    return Math.random() * 380;
};

var test_data = function () {
    var month = [];
    for (var i = 0; i < 31; i++) {
        var date = [];

        for (var j = 0; j < Math.random() * 9; j++) {
            var event = [latGen(), lngGen(), magGen(), depGen()];
            date.push(event);
        }
        month.push(date);
    }

    return month;
};