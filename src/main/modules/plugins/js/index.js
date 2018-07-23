; ;var index = function () {      //轮播图

    function checkForm(){
        var phone = $(".phoneInput").val();
        var pass = true;
            if(phone==null || phone==""){
                $(".phone-msg").removeClass('hide')
                pass=false;
            }else if (!checkPhone(phone)) {
                $(".phone-msg").removeClass('hide')
                pass=false;
            }
       if(!pass)
        return;
    $(".phone-msg").addClass('hide')
    sumbit();
    }
    function sumbit(){
        alert("提交成功")
    }

        return {
                init: function () {


                     $(document).on("click",".service-silebar li",function(){
                        $(this).siblings().removeClass("active").end().addClass("active");
                        $(".service-box .content-box div img").attr("src",$(this).attr("data-img"))
                     });
                      $(document).on("click",".getphone ",function(){
                            checkForm();

                      })
                      $(document).ready(function () {
                              var swiper = new Swiper('#banner-swiper', {
                              slidesPerView: 2,
                              slidesPerColumn: 2,
                              spaceBetween: 30,
                              pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                              },
                            });

                             var swiper = new Swiper('#client-icon-list', {
                              slidesPerView: 6,
                              spaceBetween: 5,
                              slidesPerGroup:3,
                              loop: true,
                              loopFillGroupWithBlank: true,

                              navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                              },
                            });
                        })

                }

        }
} ();
index.init();