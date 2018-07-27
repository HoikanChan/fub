var msgDetail = function () {
   $('#getcaseDeatil-modal').remodal();
    /*拇指图弹出*/
    function showDataDetailDialog2(obj){
        $(".getcaseDeatil-form").html("");
         
        var infoByCaseId = obj;
        $({})._Ajax({
            url: "usernotice/api/info/"+infoByCaseId,
            success: function (result) {
                    if (result.code==0) {

                            if (result.userNotice) {
                                var content = result.userNotice.content;
                                var dd=content.replace(/<\/?.+?>/g,"");
                                var dds=dd.replace(/ /g,"");//dds为得到后的内容
                                
                                $(".getcaseDeatil-form").html(dds);     
                                $(".getService-title-btn").text(result.userNotice.noticeTitle);
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
msgDetail.init();