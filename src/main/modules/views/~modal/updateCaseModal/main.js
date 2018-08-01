
var _updateCase = function () {
    var updateCase_validate, updateCase_modal;
    var jude = true;
    $({})._Ajax({
        url: "court/apiTree",
        success: function (result) {
                if (result.code==0) {
                    var html = template("search-court-templete",result)
                    $("#navbar-menu11").html(html);
                }
            }
    });
    function updateCaseDialog(name,no,id,idtype){
        $("#casename").val(name);
        $("#caseno").val(no);
        $("#caseno").attr("data-sourceid",id);

        $("#handlecront").val();
        $("#handlepro").val();
        $("#updatemarks").val();
       
        $({caseTypeId:idtype})._Ajax({
            url: "casetype/queryTrialRoundByCaseType",
            success: function (result) {
                    if (result.code==0) {
                        
                        var html = template("case-process-templete",result)
                        $(".case-process").html(html);
                    }
                 }
        });
    }

   
       
   

    $(function () {
        

        updateCase_modal= $("#updateCase-modal").remodal();
    
     
})
        function updateCase(){
           
        
            var caseSourceId = $("#caseno").attr("data-sourceid");
            var caseNo = $("#caseno").val();
            var courtId = $("#reasonslect11 .reaseontext").attr("data-id")?$("#reasonslect11 .reaseontext").attr("data-id"):"";
            var trialRound = $("select[name='trialRound']").find("option:selected").val();
            var desc = $("#marks").val();
            
        
            var params = {
                trialRound : trialRound,
                courtId : courtId,
                caseNo : caseNo,
                caseSourceId : caseSourceId,
                desc : desc
            }
            $(params)._Ajax({
                url: "casetrial/saveCaseTrial",
                success: function (result) {
                        if (result.code==0) {
                            toastr.success(result.msg);
                            $(".remodal-close-btn").trigger("click");
                        }else{
                            toastr.error(result.msg);
                 
                        }
                     }
            });
        } 
    
        
    return {
        init: function () {

               $(document).on("click","#reasonslect11 .reaseontext",function(event){
                        $("#navbar-menu11").toggle()
                        event.stopPropagation();
                    })
                    $(document).on("click","#reasonslect11 .first-val",function(){
                        var data = $(this).text();
                        var dataid = $(this).attr("data-id");
                        $("#reasonslect11 .reaseontext").text(data);
                        $("#navbar-menu11").hide();
                        
                    })
                    $(document).on("click","#reasonslect11 .second-val",function(){
                        var data = $(this).text();
                        var dataid = $(this).attr("data-id");
                        $("#reasonslect11 .reaseontext").text(data);
                        $("#reasonslect11 .reaseontext").attr("data-id",dataid);
                        $("#navbar-menu11").hide();
                    })
                    $(document).on("click","#reasonslect11 .last-val",function(){
                        var data = $(this).text();
                        var dataid = $(this).attr("data-id");
                        $("#reasonslect11 .reaseontext").text(data);
                        $("#reasonslect11 .reaseontext").attr("data-id",dataid);
               
                        $("#navbar-menu11").hide();
                    })
                    $(document).on("click",function(event){
                        $("#navbar-menu11").hide();
                    });
                    $(document).on("click", "#updateCase-modal .remodal-confirm", function () {
                      
                            updateCase();
                       
                                
                        });
               
                
                  
            },
            updateCase_modal:null,
            updateCaseDialog:updateCaseDialog
    }
} ();
_updateCase.init();