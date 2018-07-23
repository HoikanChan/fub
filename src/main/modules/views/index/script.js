; ;var index = function () {      //轮播图
        
          
            
         
        
            
     
   
          
  

        $(document).ready(function () {
            new Swiper('#banner', {
                loop: true,
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                },
              });
            
       //   bannerImg();
         
          change_main_current_class(0);
        //  getNews();
      })
        return {
                init: function () {

                    var titles = $('.service-box ul').children();
                    var divs = $('.content-box').children();
                    for(var i=0;i<titles.length;i++){
                         $(titles[i]).attr("id",i);
             
                         $(titles[i]).click(function() {
             
                            for(var j=0;j<titles.length;j++){
                                 $(titles[j]).attr("class","");
                                 $(divs[j]).css("display","none");
                            }
                                 $(this).addClass("active");
                                 $(divs[this.id]).css("display","block");
                         });
                    }

                    //  $(document).on("click",".service-silebar li",function(){
                    //     $(this).siblings().removeClass("active").end().addClass("active");
                    //     $(".service-box .content-box div img").attr("src",$(this).attr("data-img"))
                    //  });
                      $(document).on("click",".getphone",function(){
                        checkLogin(function (){
                            checkForm();
                        })

                      })
                      
                  
                       
                }

        }
} ();
index.init();