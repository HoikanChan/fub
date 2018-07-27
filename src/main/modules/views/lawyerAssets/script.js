var userCenter = (function() {
  var page = 1
  var inquery_validate

  function getMycase() {
    var params = {
      clientId: clientId,
      sidx: 'createTime',
      order: 'desc'
    }

    $('#my-cases .pager').tablePager({
      url: 'order/queryOrderList',
      searchParam: params,
      success: function(result) {
        if (result.code == 0) {
          if (result) {
            var html = template('case-result-templete', result.data)

            $('.my-case-box').html(html)
          }
        }
      }
    })

    //   $('#my-cases .mycasepage .pager').tablePager({
    //     url: "order/queryOrderList",
    //     searchParam:params,
    //     success: function (result) {
    //        if(result.code == 0){
    //          console.log(result.data)
    //           // var html1 = template('my-cases-template', result.data);
    //           // $(".my-cases-box").html(html1);
    //           var html = template('search-result-templete', result.data);
    //           $(".my-case-box").html(html);

    //         if(result.data.totalCount<10){
    //             $(".page-row").hide()
    //         }else{
    //             $(".page-row").show()
    //         }
    //         if(result.data.totalCount==0){
    //             $(".my-cases-box").html("<P class='noresult'>抱歉，没有相关案件</P>")
    //         }
    //        }else{
    //             toastr.warning(result.msg);
    //        }
    //       $(".my-cases-content .totalNum").text(result.data.totalCount);
    //     }
    // })
  }
  $(function() {
    $('aside .right-icon').click(function(e) {
      e.stopPropagation()
      if (e.target.classList.contains('fa-chevron-down')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .show()
        $(e.target)
          .addClass('fa-chevron-up')
          .removeClass('fa-chevron-down')
      } else if (e.target.classList.contains('fa-chevron-up')) {
        $(e.target)
          .siblings('div.dropdown-menu')
          .hide()
        $(e.target)
          .removeClass('fa-chevron-up')
          .addClass('fa-chevron-down')
      }
    })
  })
  return {
    init: function() {
      $('.assets-content').html(
        template('assets-template', {
          balance: 21,
          total: '1,200.00',
          personal: '1,200.00',
          team: '1,200.00',
          count: 12,
          info: {
            time: '2018-01 ~ 2018-10',
            total: '1,200.00',
            personal: '1,200.00',
            team: '1,200.00',
            count: 12
          },
          pages: 3,
          bills: [
            {
              no: '1123234256532',
              amount: '250.00',
              type: '事务贷',
              region: '个人',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              amount: '250.00',
              type: '事务贷',
              region: '个人',
              time: '2015-06-05 15:33:30'
            },
            {
              no: '1123234256532',
              amount: '250.00',
              type: '事务贷',
              region: '个人',
              time: '2015-06-05 15:33:30'
            }
          ]
        })
      )
    }
  }
})()
userCenter.init()
