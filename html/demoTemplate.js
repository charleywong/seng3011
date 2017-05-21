$(document).ready(function(){
    $("#demoContent").hide();
    $("#listentothis").hide();
    
    $("#startDemo").click(function () {
        $("#demoContent").fadeIn();
        $("#startContent").hide();
    });
    
    $("#searchA").keyup(function () {
        var filter = $(this).val();
        $('a', 'div#myListA').each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show()
            }
        });
    });
    
    $("#listentothis")
});
