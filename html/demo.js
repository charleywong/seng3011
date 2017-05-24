$(document).ready(function() {
    $.getJSON("/batch.json", function(data, statusText) {
        let html = "";
        let compare = (a, b) => {
            return b.currentData.AV_Return - a.currentData.AV_Return;
        };
        data.long = data.long.sort(compare);
        data.short = data.short.sort(compare);

        for (let l of data.long) html += `
        <a 
            href="#" 
            class="list-group-item" 
            data-company="${l.InstrumentID}" 
            data-list="long"
            data-data='${JSON.stringify(l.currentData)}'
        >
            ${l.InstrumentID}
        </a>`;
        $("#myListB").html(html);
        html = "";
        for (let l of data.short) html += `
        <a 
            href="#" 
            class="list-group-item" 
            data-company="${l.InstrumentID}" 
            data-list="short"
            data-data='${JSON.stringify(l.currentData)}'
        >
            ${l.InstrumentID}
        </a>`;
        $("#myListA").html(html);

        $(".list-group-item").click(function(event) {
            event.preventDefault();
            var company = $(this).data("company");
            var current = $(this).data("data");
            var list = $(this).data("list");

            $("#days").text(list == "long" ? 365 : 30);
            $("#av_return_status").text("positive");
            $("#av_return").text(current.AV_Return * 100 + " %");
            $.get("/api/company/" + company, function(data, textStatus) {
                $("#analysis_company_name").text(data.name);
                $("#analysis_company_id").text(data.unique_symbol);

                $("#company_name").text(data.name);
                $("#company_logo").attr("src", data.info.data.logo_url);
                $("#company_id").text(data.unique_symbol);
                $("#exchange").text(data.exchange_symbol);
                $("#industry").text(data.info.data.industry.name);
                $("#address").text(data.info.data.address);
                $("#year_founded").text(data.info.data.year_founded);
                $("#ceo").text(
                    data.info.data.ceo.name +
                        " - " +
                        data.info.data.ceo.age +
                        " years old"
                );

                // News
                $("#newsContent #company_name").text(data.name);
                var cardsHTML = "";
                for (let news of data.news.feed.entries) {
                    cardsHTML += `<div class="col-md-4">
                  <div class="card">
                    <div class="cardbox">
                      <h4><b>${news.title}</b></h4>
                      <hr class="article-divider">
                      <p class="article-date">${news.pubDate}</p>
                      <p>${news.contentSnippet}</p>
                      <a href="${news.link}">View full article...</a>
                    </div>
                  </div>
                </div>`;
                }

                $("#newsContent .row").html(cardsHTML);
            });
        });
    });

    $("#view2").hide();

    $("#state1").click(function() {
        $("#view1").show();
        $("#view2").hide();
    });

    $("#state2").click(function() {
        $("#view1").hide();
        $("#view2").show();
    });

    $("#searchA").keyup(function() {
        var filter = $(this).val();
        $("a", "div#myListA").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });

    $("#searchB").keyup(function() {
        var filter = $(this).val();
        $("a", "div#myListB").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
});
