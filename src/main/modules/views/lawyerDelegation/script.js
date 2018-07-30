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
      $("#my-delegation").addClass("active");
      $('#affairs-delegation .my-delegation').html(
        template('my-delegation-template', {
          delegations: [
            {
              type: '时间',
              client: '杭州市西湖区古荡湾',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            },
            {
              type: '时间',
              client: '杭州市西湖区古荡湾',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            },
            {
              type: '时间',
              client: '杭州市西湖区古荡湾',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            }
          ]
        })
      )
      $('#affairs-delegation .delegation-to-me').html(
        template('delegation-to-me-template', {
          delegations: [
            {
              type: '时间',
              client: '张三',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            },
            {
              type: '时间',
              client: '张三',
              validTime: '2015-06-05 15:33:30',
              invalidTime: '2015-06-05 15:33:30'
            }
          ]
        })
      )
    }
  }
})()
userCenter.init()
