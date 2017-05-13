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
        getOnLoadData(window.innerWidth, window.innerHeight);
    } else {
        $("aside").show();
        $("#language").show();
        bindEvent();
        getOnLoadData(window.innerWidth * 0.8, window.innerHeight);
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

    $('#modal').on('show.bs.modal', function () {
        console.log("Load geo data.");
        if (document.body.clientWidth > 400) {
            Global_Country_Name = $("aside input").val();
            renderPage(1);
        }
    }).on('shown.bs.modal', function () {
        if (document.body.clientWidth < 400) {
            Global_Country_Name = $("#hideNav input").val();
            renderPage(1);
        }
    })

});

var dataLink = {
    "onLoad": "/API/Initialize",
    "top10": "/API/top10",
    "dotData": "/API/DotData",
    "yearData": "/API/yearData",
    "depthData": "/API/depthData"
};

var getDiagramData = function (url, method, inputData, chartCreation, heading) {
    $.ajax({
        url: url,
        type: method ? method : "GET",
        contentType: "application/json; charset=utf-8",
        async: true,
        data: inputData,
        dataType: 'json',
        success: function (data) {
            chartCreation(data, "#chartArea", null, heading, data[0].iso3);
        }
    });
};

function renderPage(pageNumber) {

    GraphicChart.removeAll();

    if (pageNumber == 1) {

        getDiagramData(dataLink.dotData,
            "POST",
            JSON.stringify({"countryName": Global_Country_Name}),
            GraphicChart.createGeoDotChart,
            chartHeading.dotData[language]);
    } else if (pageNumber == 2) {
        getDiagramData(dataLink.depthData,
            "POST",
            JSON.stringify({"countryName": Global_Country_Name}),
            GraphicChart.createDepthDotChart,
            chartHeading.depthData[language]);
    } else if (pageNumber == 3) {
        getDiagramData(dataLink.top10,
            "GET",
            null,
            GraphicChart.createTop10PieChart,
            chartHeading.top10[language]);
    } else {
        getDiagramData(dataLink.yearData,
            "POST",
            JSON.stringify({"countryName": Global_Country_Name}),
            GraphicChart.createYearlyBarChart,
            chartHeading.yearData[language]);
    }

    renderPagination(20, pageNumber);
}


function getOnLoadData(width, height) {
           $.ajax({
           url: dataLink.onLoad,
           type: 'GET',
           contentType: "application/json; charset=utf-8",
           async: true,
           dataType: 'json',
           success: function (MonthPointData) {
               console.log(MonthPointData);
               buildEnvironment(width, height, MonthPointData);
           }
       });
}

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