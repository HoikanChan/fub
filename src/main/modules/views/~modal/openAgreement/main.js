var openAgreement = function () {
   $('#openAgreement-modal').remodal();
    /*拇指图弹出*/
    showDataDetailDialog2()
    function showDataDetailDialog2(obj){
        // $(".openAgreement-form").html(obj);
         
        var infoByCaseId = obj;
        // $({})._Ajax({
        //     url: "usernotice/api/info/"+infoByCaseId,
        //     success: function (result) {
        //             if (result.code==0) {
        //
        //                     if (result.userNotice) {
        //                         var content = result.userNotice.content;
        //                         var dd=content.replace(/<\/?.+?>/g,"");
        //                         var dds=dd.replace(/ /g,"");//dds为得到后的内容
        //
        //                         $(".openAgreement-form").html(dds);
        //                     }
        //
        //             }
        //
        //     }
        //
        // });
    }
    return {
        init: function () {
          
            },
            showDataDetailDialog2:showDataDetailDialog2,
    }
} ();
openAgreement.init();