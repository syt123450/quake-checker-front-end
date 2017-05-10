$(function () {

    $("#div1").hide();
    $("#div2").hide();
    $("#div3").hide();
   

    $("#button1").click(function () {

        $("#div1").fadeIn("slow");

    });
    $("#button2").click(function () {

        $("#div2").fadeIn("slow");

    });
    $("#button3").click(function () {

        $("#div3").fadeIn("slow");

    });

    connect();

    $(window).unload(function () {
        disconnect();
    });

});