$(document).ready(function(){
/*    $("#demoContent").hide();
    
    $("#startDemo").click(function () {
        $("#demoContent").fadeIn();
        $("#startContent").hide();
    });
*/    

    $("#state1").click(function () {
        $("#view1").show();
        $("#view2").hide();
    });
    
    $("#state2").click(function () {
        $("#view1").hide();
        $("#view2").show();
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
    
});
