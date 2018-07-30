var openAgreement = function () {
   $('#openAgreement-modal').remodal();
    /*拇指图弹出*/
    showDataDetailDialog2()
    function showDataDetailDialog2(obj){
        $(".openAgreement-form").html("协议，网络协议的简称，网络协议是通信计算机双方必须共同遵从的一组约定。如怎么样建立连接、怎么样互相识别等。只有遵守这个约定，计算机之间才能相互通信交流。它的三要素是：语法、语义、时序。\n" +
            "为了使数据在网络上从源到达目的，网络通信的参与方必须遵循相同的规则，这套规则称为协议（protocol），它最终体现为在网络上传输的数据包的格式。\n" +
            "协议往往分成几个层次进行定义，分层定义是为了使某一层协议的改变不影响其他层次的协议。");
         
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