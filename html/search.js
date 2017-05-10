$(document).ready(function() {
    $("#submitRequest").click(function(event) {
        event.preventDefault();
        $(".loader").show();

        $(".animate-bottom").hide();
        var parts = $("#date").val().split("-");
        var year = parts[0];
        var month = parts[1];
        var day = parts[2];
        var fixedDateFormat = day + "/" + month + "/" + year;

        //form checking
        var instrumentID = $("#InstrumentID").val();
        var upperWindow = $("#UpperWindow").val();
        var lowerWindow = $("#LowerWindow").val();

        //remove all spaces in instrumentID
        instrumentID = instrumentID.replace(/\s/g, "");

        // check whether instrumentID conform to regex
        var istrIDs = instrumentID.split(",");
        for (var i = 0; i < istrIDs.length; i++) {
            if (
                /^[a-zA-Z]{1,}$/.test(istrIDs[i]) == false &&
                /^[a-zA-Z]{1,}[\.]{1}[a-zA-Z]{1,}$/.test(istrIDs[i]) == false
                // /[a-zA-Z]+(\.[a-zA-Z]+){0,1}/.test(istrIDs[i]) === false
            ) {
                sweetAlert(
                    istrIDs[i] +
                    " is an invalid company code id (valid codes do not guarantee their existence)."
                );
                $(".loader").hide();
                return;
            }
        }

        // check whether upper and lower windows are within bounds
        if (parseInt(upperWindow) < 0 || parseInt(lowerWindow) < 0) {
            sweetAlert("Upper and Lower Windows cannot be negative.");
            $(".loader").hide();
            return;
        }

        var largeQueryBound = 50;
        // check for VERY LARGE query
        if (parseInt(upperWindow) + parseInt(lowerWindow) >= largeQueryBound) {
            sweetAlert({
                title: "Query upper and lower windows exceeds " +
                    largeQueryBound,
                text: "This request may take a very long time to complete, or timeout.",
                type: "warning",
                confirmButtonText: "Continue"
            });
        }

        var formData = [
            { name: "InstrumentID", value: $("#InstrumentID").val() },
            { name: "UpperWindow", value: $("#UpperWindow").val() },
            { name: "LowerWindow", value: $("#LowerWindow").val() },
            { name: "DateOfInterest", value: fixedDateFormat }
        ];
        // add vars
        if ($("#VarCMReturn").is(":checked")) {
            formData.push({ name: "ListOfVar", value: "CM_Return" });
        }
        if ($("#VarAVReturn").is(":checked")) {
            formData.push({ name: "ListOfVar", value: "AV_Return" });
        }

        // serialize data
        formData = $.param(formData);

        var API_ENDPOINT = "/api/company_returns";

        // ajax call to get result
        $.get(API_ENDPOINT, formData, function(result, status) {
            $(".loader").hide();
            $(document).scrollTop($(".animate-bottom").position().top);
            if (result.hasOwnProperty("error")) {
                var errorThrown = "Error: " + result.error + "\n";
                errorThrown += "Try again\n";
                sweetAlert({
                    title: "Error!",
                    text: errorThrown,
                    type: "error",
                    confirmButtonText: "Oh Noes..."
                });
                return;
            }
            $(".animate-bottom").show();
            var tableData = [];

            //populate tableData column names (create a row with those names)
            var headRow = ["Instrument ID", "Date", "Return"];
            if (result.CompanyReturns[0].Data.length === 0) {
                sweetAlert({
                    title: "Error!",
                    text: "We couldn't find any data that meet your requirement",
                    type: "error",
                    confirmButtonText: "Oh Noes..."
                });
                return;
            }
            if (result.CompanyReturns[0].Data[0].hasOwnProperty("CM_Return")) {
                headRow.push("Cumulative Returns");
            }
            if (result.CompanyReturns[0].Data[0].hasOwnProperty("AV_Return")) {
                headRow.push("Average Returns");
            }
            tableData.push(headRow);

            for (var i = 0; i < result.CompanyReturns.length; i++) {
                var instrumentID = result.CompanyReturns[i].InstrumentID;
                var instrData = result.CompanyReturns[i].Data;

                //loop through data
                for (var j = 0; j < instrData.length; j++) {
                    var rowData = [instrumentID];
                    var thisData = instrData[j];

                    rowData.push(thisData.Date);
                    rowData.push(thisData.Return);

                    if (thisData.hasOwnProperty("CM_Return")) {
                        var cmret = thisData.CM_Return;
                        if (cmret != null) {
                            rowData.push(cmret);
                        } else {
                            rowData.push(0);
                        }
                    }
                    if (thisData.hasOwnProperty("AV_Return")) {
                        var avret = thisData.AV_Return;
                        if (avret != null) {
                            rowData.push(avret);
                        } else {
                            rowData.push(0);
                        }
                    }
                    //console.log("--------------");

                    tableData.push(rowData);
                }
            }
            //chartDataSets.push({"instrumentID": "APPL"});
            //console.log(JSON.stringify(chartDataSets));

            //populate table
            //  Write Bootstrap style table header to var html

            var html = "<h3>Company Returns Summary</h3>";
            $("#result").html = html;

            var i = 0;
            html = '<thead><tr class="info">';
            for (
                var j = 0; j < tableData[i].length; j++
            ) html += '<th>' + tableData[i][j] + '</th>';
            html += '</thead></tr>';
            html += '<tbody>';
            //  Write table data to var html
            for (var i = 1; i < tableData.length; i++) {
                if (i == 10) {
                    html +=
                        '<tr><td><button type="button" id="btn" class="btn" data-toggle="collapse" data-target=".customcollapse">Click to expand</button></td>';
                    html += '<td></td>'.repeat(tableData[i].length - 1);
                    html += '</tr>';
                }
                if (i >= 10) html += '<tr class="collapse out customcollapse">';
                else html += '<tr>';

                for (var j = 0; j < tableData[i].length; j++) {
                    if (j > 1) {
                        var tempVal = tableData[i][j];
                        var cellType = '<td';
                        if (tempVal < 0)
                            cellType += ' class="negative"';
                        else if (tempVal > 0)
                            cellType += ' class="positive"';
                        cellType += '>';
                        html += cellType + tableData[i][j] + '</td>';
                    } else {
                        html += '<td>' + tableData[i][j] + '</td>';
                    }
                }
                html += '</tr>';
            }
            html += "</tbody>";
            $("#resultTable").html(html);
            $(btn).on("click", function() {
                // $(this).closest("tr").hide();
                $(this).closest("tr").hide();
                $('#resultTable').append($(this));
            });

            // NEWS STUFF HERE
            var newsSegment = "<h3>Company News</h3>";
            newsSegment += '<div class="col-md-9"><div class="row">';
            newsSegment += '<div class="tab-content">';
            // newsSegment += "</div></div></div>";

            var newsSuppl = '<nav class="col-md-3">';
            newsSuppl +=
                '<ul class="nav nav-pills nav-tabs nav-stacked" data-spy="affix">';
            // </nav></ul>
            if (result.news.length === 0)
                result.news = [
                    { headline: "We couldn't find any news", newsText: "" }
                ];
            for (var i = 0; i < result.news.length; i++) {
                var hLine = result.news[i].headline;
                var tStamp = result.news[i].timeStamp;
                var newsText = result.news[i].newsText;
                var article = "article" + i;
                newsSegment +=
                    '<div id="' +
                    article +
                    '" class="tab-pane fade in active">';
                newsSegment += '<div class="page-header">';
                newsSegment += "<h4>" + hLine + "</h4>";
                newsSegment += "</div>";
                newsSegment +=
                    "<p>" +
                    newsText.replace(/\\n/g, "<br/>").replace(/\\/g, "") +
                    "</p>";
                newsSegment += "</div>";

                // if (i == 0)
                //     newsSuppl +=
                //         '<li class="active"><a data-toggle="tab" href="#' +
                //         article +
                //         '">' +
                //         hLine +
                //         "</a></li>";
                // else
                //     newsSuppl +=
                //         '<li><a data-toggle="tab" href="#' +
                //         article +
                //         '">Article2</a></li>';
            }
            newsSegment += "</div></div></div>";
            newsSuppl += '</ul></nav><div class="clearfix visible-lg"></div>';
            newsSegment += newsSuppl;
            $("#newsStuff").html(newsSegment);

            google.charts.load("current", { packages: ["line"] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = new google.visualization.DataTable();

                //chart
                data.addColumn("string", "Date");

                var gglChartData = [];

                console.log(JSON.stringify(result));

                for (var i = 0; i < result.CompanyReturns.length; i++) {
                    // add required columns
                    var companyData = result.CompanyReturns[i].Data;
                    var instrumentID = result.CompanyReturns[i].InstrumentID;
                    console.log(instrumentID);

                    //push required columns
                    data.addColumn("number", instrumentID + " Returns");
                    if (companyData[0].hasOwnProperty("CM_Return")) {
                        data.addColumn("number", instrumentID + " Cumulative Returns");
                    }
                    if (companyData[0].hasOwnProperty("AV_Return")) {
                        data.addColumn("number", instrumentID + " Average Returns");
                    }

                    var rowgglData = [];
                    for (var j = 0; j < companyData.length; j++) {
                        if (j >= gglChartData.length) {
                            gglChartData.push([companyData[j].Date]);
                        }

                        gglChartData[j].push(companyData[j].Return);
                        if (companyData[j].hasOwnProperty("CM_Return")) {
                            gglChartData[j].push(companyData[j].CM_Return);
                        }
                        if (companyData[j].hasOwnProperty("AV_Return")) {
                            gglChartData[j].push(companyData[j].AV_Return);
                        }
                    }
                }

                data.addRows(gglChartData);

                var options = {
                    title: "Company Performance",
                    titleTextStyle: {
                        fontSize: 34
                    },
                    curveType: "function",
                    legend: { position: "bottom" },
                    explorer: { maxZoomIn: 0.01, keepInBounds: false },
                    animation: { duration: 200, easing: "in", startup: true },
                    pointSize: 5,
                    width: 1080,
                    height: 600
                };

                // var chart = new google.visualization.LineChart(
                //     document.getElementById("chart")
                // );
                var chart = new google.charts.Line(
                    document.getElementById("chart")
                );
                chart.draw(data, google.charts.Line.convertOptions(options));
            }
        });
    });
});