var userCenter = (function() {
  var page = 1
  var inquery_validate

  function getMycase() {
    var params = {
      clientId: clidentId,
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
      $('#my-team .my-team-content').html(
        template('my-team-template', {
          myTeams: [
            {
              name: 'issac',
              office: '杭州市西湖区古荡湾',
              contribution: '692',
              lastOnlineTime: '2015-06-05 15:33:30'
            },
            {
              name: 'leon',
              office: '杭州市西湖区古荡湾',
              contribution: '692',
              lastOnlineTime: '2015-06-05 15:33:30'
            },
            {
              name: 'mei',
              office: '杭州市西湖区古荡湾',
              contribution: '125',
              lastOnlineTime: '2015-06-05 15:33:30'
            }
          ],
          ranking:[
            {rank:1,name:'张三',visit:789},
            {rank:2,name:'张三',visit:789},
            {rank:3,name:'张三',visit:789},
            {rank:4,name:'张三',visit:789},
            {rank:5,name:'张三',visit:789},
            {rank:6,name:'张三',visit:789}
          ],
          messages:{},
          pages:20
        })
      )
    }
  }
})()
userCenter.init()
