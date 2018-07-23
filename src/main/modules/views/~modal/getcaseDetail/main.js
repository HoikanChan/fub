var caseDetail = function () {
    var modal = $('#getcaseDeatil-modal').remodal();
    /*拇指图弹出*/
    function showDataDetailDialog2(obj){
        $(".getcaseDeatil-form").html("");
        
        var infoByCaseId = obj;
        $({})._Ajax({
            url: "casedetail/infoByCaseId/"+infoByCaseId,
            success: function (result) {
                    if (result.code==0) {

                            if (result.data) {
                                  
                                $(".getcaseDeatil-form").html(result.data.content);     
                            
                            }       
                           
                    }
            
            }

    }); 
        }
    return {
        init: function () {
           
            },
            showDataDetailDialog2:showDataDetailDialog2,
    }
} ();
caseDetail.init();