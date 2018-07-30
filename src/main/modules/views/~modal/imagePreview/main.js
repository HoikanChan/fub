var imagePreview = function () {
   $('#imagePreview-modal').remodal();
    /*拇指图弹出*/
    function showDataDetailDialog2(obj){
        $(".imagePreview-form").html('<img src="'+ obj +'" width="560" />');
    }
    return {
        init: function () {
          
            },
            showDataDetailDialog2:showDataDetailDialog2,
    }
} ();
imagePreview.init();