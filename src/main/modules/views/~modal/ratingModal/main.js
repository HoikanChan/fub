var rating = function () {
    var modal = $('#getcaseDeatil-modal').remodal();
    /*拇指图弹出*/
    function showratingDialog(orderid,clientid){
        $(".rating-form").html("");
        $("#rating-modal").attr("orderid",orderid).attr("clientid",clientid);
        
        }
      //评分
      var starRating = 0;
      var star1 =  $('#starRating .photo span');
      var star1num = $('#starRating .starNum');
      var star2 =  $('#starRating2 .photo span');
      var star2num = $('#starRating2 .starNum');
      star1.on('mouseenter',function () {
          var index = $(this).index()+1;
          $(this).prevAll().find('.high').css('z-index',1)
          $(this).find('.high').css('z-index',1)
          $(this).nextAll().find('.high').css('z-index',0)
         
      })
      $('#starRating .photo').on('mouseleave',function () {
          $(this).find('.high').css('z-index',0)
          var count = starRating / 1
          if(count == 5) {
            star1.find('.high').css('z-index',1);
          } else {
            star1.eq(count).prevAll().find('.high').css('z-index',1);
          }
          
      })
      star1.on('click',function () {
          var index = $(this).index()+1;
          $(this).prevAll().find('.high').css('z-index',1)
          $(this).find('.high').css('z-index',1)
          starRating = index;
          star1num.html(starRating+'星');
         
      })
      //专业能力评价
      star2.on('mouseenter',function () {
        var index = $(this).index()+1;
        $(this).prevAll().find('.high').css('z-index',1)
        $(this).find('.high').css('z-index',1)
        $(this).nextAll().find('.high').css('z-index',0)
       
    })
    $('#starRating2 .photo').on('mouseleave',function () {
        $(this).find('.high').css('z-index',0)
        var count = starRating / 1
        if(count == 5) {
          star2.find('.high').css('z-index',1);
        } else {
          star2.eq(count).prevAll().find('.high').css('z-index',1);
        }
       
    })
    star2.on('click',function () {
        var index = $(this).index()+1;
        $(this).prevAll().find('.high').css('z-index',1)
        $(this).find('.high').css('z-index',1)
        starRating = index;
        star2num.html(starRating+'星');
       
    })
   
    
    return {
        init: function () {
           
            $(document).on("click","#rating-modal .remodal-confirm",function(){
                
                var star1 = $("#starRating .starNum").text();
                var star2 = $("#starRating2 .starNum").text();
                var orderid = $("#rating-modal").attr("orderid");
                var clientid =  $("#rating-modal").attr("clientid");

                var params = {
                    orderId:orderid,
                    clientId:clientid,
                    serviceStar:star1,
                    professionStar:star2
                }
                $(params)._Ajax({
                    url: "comment/api/save",
                    success: function (result) {
                   
                            if (result.code==0) {
                                toastr.success(result.msg)
                            }
                        }
                    });
            })

            },
            showratingDialog:showratingDialog,
    }
} ();
rating.init();