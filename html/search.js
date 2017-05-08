$(document).ready(function() {
    $("#submitRequest").click( function(event) {
        event.preventDefault();

        var parts = $("#date").val().split('-');
        var year = parts[0];
        var month = parts[1];
        var day = parts[2];
        var fixedDateFormat = month+"/"+day+"/"+year;

        // serialize form data

        //add date
        var formData = [
            {name:"InstrumentID", value:$("#instrumentID").val()},
            {name:"UpperWindow", value:$("#UpperWindow").val()},
            {name:"LowerWindow", value:$("#LowerWindow").val()},
            {name:"DateOfInterest", value:fixedDateFormat}
        ];
        // add vars
        if ($("#VarCMReturn").is(":checked")) {
            formData.push({name:"ListOfVar", value:"CM_Return"});
        }
        if ($("#VarAVReturn").is(":checked")) {
            formData.push({name:"ListOfVar", value:"AV_Return"});
        }

        // serialize data
        formData = $.param(formData);

        var API_ENDPOINT = '/api/company_returns';

        // ajax call to get result
        $.get(API_ENDPOINT, formData, function(result, status) {
            //we can use $.ajax instead if there's something we can do with ajax
            //that we can't do with $.get
            //option is available. just uncomment the stuff below

            // $.ajax(API_ENDPOINT, {
            // 	"data": formData,
            // 	"type": "GET"
            // })
            // .fail(function(jqHXR, status, errorThrown) {
            // 	alert(errorThrown);
            // })
            // .done(function(result, status, jqHXR) {
                // alert("success")
                // alert(result.error);
            if (result.error !== undefined) {
                var errorThrown = "Error: " + result.error + "\n";
                errorThrown += "Try again\n";
                sweetAlert({
                    title: "Error!",
                    text: errorThrown,
                    type: "error",
                    confirmButtonText: "Oh Noes..."
                });
            }
            var tableData = [];

            //populate tableData column names (create a row with those names)
            var headRow = ["Instrument ID", "Date", "Return"];
            if (result.CompanyReturns[0].Data[0].hasOwnProperty("CM_Return")) {
                headRow.push("Cumulative Returns");
            }
            if (result.CompanyReturns[0].Data[0].hasOwnProperty("AV_Return")) {
                headRow.push("Average Returns");
            }
            tableData.push(headRow);

            for (var i=0; i < result.CompanyReturns.length; i++) {
                var instrumentID = result.CompanyReturns[i].InstrumentID;
                var instrData = result.CompanyReturns[i].Data;

                //loop through data
                for (var j=0; j < instrData.length; j++) {
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
            
            var html = '<h3>Company Returns Summary</h3>';
            $('#result').html = html;
            
            var i = 0;
            html = '<thead><tr>';
            for (var j=0; j < tableData[i].length; j++)
                html += '<th>' + tableData[i][j] + '</th>';
            html += '</thead></tr>';
            html += '<tbody>';
            //  Write table data to var html
            for(var i = 1; i < tableData.length; i++) {
                <!-- Create a collapse when record = 10 -->
                if (i == 10) {
                    html += '<tr><td><button type="button" class="btn" data-toggle="collapse" data-target=".customcollapse">Click to expand</button></td>';
                    html += "<td></td>".repeat(tableData.length-1);
                    html += '</tr>';
                }
                if (i >= 10)
                    html += '<tr class="collapse out customcollapse">';
                else
                    html += '<tr>';

                for (var j=0; j < tableData[i].length; j++) {
                    html += '<td>' + tableData[i][j] + '</td>';
                }
                html += '</tr>';
            }
            html += '</tbody>'
            $('#resultTable').html(html);

            // NEWS STUFF HERE
            var html2 = '<h3>Company Returns News</h3>';
            for (var i=0; i< result.news.length; i++) {
                var hLine = result.news[i].headline;
                var tStamp = result.news[i].timeStamp;
                var newsText = result.news[i].newsText;
                html2 += '<h4>' + hLine + '</h4>';
                html2 += '<p>' + tStamp + '</p>';
                html2 += '<p>' + newsText + '</p>';
            }
            $('#newsStuff').html(html2);
            
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = new google.visualization.DataTable();

                //chart
                data.addColumn("string", "Date");

                var gglChartData = [];

                console.log(JSON.stringify(result));

                for (var i=0; i < result.CompanyReturns.length; i++) {
                    // add required columns
                    var companyData = result.CompanyReturns[i].Data;
                    var instrumentID = result.CompanyReturns[i].InstrumentID;
                    console.log(instrumentID);


                    //push required columns
                    data.addColumn("number", instrumentID+" Rtrn");
                    if (companyData[0].hasOwnProperty("CM_Return")) {
                      data.addColumn("number", instrumentID+" CMRtrn");
                    }
                    if (companyData[0].hasOwnProperty("AV_Return")) {
                      data.addColumn("number", instrumentID+" AVRtrn");
                    }

                    var rowgglData = [];
                    for (var j=0; j < companyData.length; j++) {
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
                title: 'Company Performance',
                curveType: 'function',
                legend: { position: 'bottom' },
                explorer: {maxZoomIn: 0.01, keepInBounds: true},
                           pointSize: 5
                };

                var chart = new google.visualization.LineChart(document.getElementById('chart'));

                chart.draw(data, options);
            };
        })
    });
});