/*
* Version 1.0
* 2015-12-20 by sullivan
* AJAX Pager
*/
;
(function (window, $) {

    var tablePager = window.tablePager1 = {
        opts: {
            length: 10,
            preText: "上一页",
            nextText: "下一页",
            firstText: "",
            lastText: "",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: false,
            showLast: false,
            loadTarget:null,
            url: "",
            type: "GET",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            // pagerElement:null,  //当该DOM元素还没加载出现时，需要添加
            error: function() {
                alert("抱歉,请求出错,请重新请求！");
            },

            page: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0} pager-btn'>{1}</span>",
            pageHtml: "<a class='pager-btn' href='javascript:void(0)' onclick='tablePager1.doPage({0},{1},{2})'>{3}</a>",
            rightHtml: "<span class='text'>每页 {0} 条记录， 共 {1} 页 {2} 条记录，当前第 {3} 页</span>",
            buttonHtml:"<input type='text' id='txtToPager' /><button id='btnJump' onclick='tablePager1.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both; class='pager-btn'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;
            _self.opts = $.extend({}, _self.opts, op);
             _self.pagerElement = obj;
            _self.doPage(_self.opts.page, _self.opts.length, _self.opts.searchParam);

            return _self.opts;
        },
        doPage: function (index, length, searchParam) {
            var _self = this;

            _self.opts.page = index;
            _self.opts.length = length;
            _self.opts.searchParam = searchParam;
            //判断有没封装ajax
            if ($()._Ajax) {
                $($.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                        limit: _self.opts.length || 10
                        
                }))._Ajax({
                    type: _self.opts.type,
                    dataType: _self.opts.dataType,
                    loadTarget:_self.opts.loadTarget,
                    url: _self.opts.url,
                    success: function (data) {
                        _self.opts.success(data);
                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);   //取消页码
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    }
                })
            } else {
                 $.ajax({
                    type: _self.opts.type,
                    data: $.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                       
                    }),
                    dataType: _self.opts.dataType,
                    url: _self.opts.url,
                    beforeSend: function () {
                        _self.opts.beforeSend();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data) {
                        _self.opts.success(data);

                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    },
                    complete: function () {
                        _self.opts.complete();
                    }
                });
            }
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.length);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.page == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.page - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.page == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.page + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            /*
                前：当前页 > 偏移量 + 至少保留 + 1
                后：当前页 < 总页码 - 偏移量 - 至少保留
            */

            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            /*页码*/
            if (_self.opts.page > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.page - _self.opts.shiftingLeft; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.page, 'current'));

            if (_self.opts.page <= shiftingRightStart) {

                for (i = _self.opts.page + 1; i < _self.opts.page + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.page + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }
            _self.pagerElement.html(stringFormat(_self.commonHtmlText.rightHtml, _self.opts.length, _self.opts.totalPage,_self.opts.totalCount,_self.opts.page,_self.opts.page)).append(pageText).append(_self.commonHtmlText.buttonHtml).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return stringFormat(_self.commonHtmlText.pageHtml, index, _self.opts.length, JSON.stringify(_self.opts.searchParam), text);
        },
        // keyDownJump: function (e) {
        //     if ( e.which === 13 ) {
        //         e.preventDefault();
        //         tablePager.jumpToPage();
        //         return false;
        //     }
        // },
        jumpToPage: function () {
            var _self = this;
            var $txtToPager = $("#txtToPager", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.length, _self.opts.searchParam);
            } else {
                $txtToPager.focus();
            }
        }
    }
    
    $(document).on("keydown" , "#txtToPager", function (e) {
        if ( e.which === 13 ) {
                e.preventDefault();
                tablePager.jumpToPage();
                return false;
            }
    })

    $.fn.tablePager = function (option) {
        return tablePager.init($(this),option);
    };


    var tablePagerThree = window.tablePager2 = {
        opts: {
            length: 3,
            preText: "上一页",
            nextText: "下一页",
            firstText: "",
            lastText: "",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: false,
            showLast: false,
            loadTarget:null,
            url: "",
            type: "GET",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            // pagerElement:null,  //当该DOM元素还没加载出现时，需要添加
            error: function() {
                alert("抱歉,请求出错,请重新请求！");
            },

            page: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0} pager-btn'>{1}</span>",
            pageHtml: "<a class='pager-btn' href='javascript:void(0)' onclick='tablePager2.doPage({0},{1},{2})'>{3}</a>",
            rightHtml: "<span class='text'>每页 {0} 条记录， 共 {1} 页 {2} 条记录，当前第 {3} 页</span>",
            buttonHtml:"<input type='text' id='txtToPagerThree' /><button id='btnJump' onclick='tablePager2.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both; class='pager-btn'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;
            _self.opts = $.extend({}, _self.opts, op);
             _self.pagerElement = obj;
            _self.doPage(_self.opts.page, _self.opts.length, _self.opts.searchParam);

            return _self.opts;
        },
        doPage: function (index, length, searchParam) {
            var _self = this;

            _self.opts.page = index;
            _self.opts.length = length;
            _self.opts.searchParam = searchParam;
            //判断有没封装ajax
            if ($()._Ajax) {
                $($.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                        
                }))._Ajax({
                    type: _self.opts.type,
                    dataType: _self.opts.dataType,
                    loadTarget:_self.opts.loadTarget,
                    url: _self.opts.url,
                    success: function (data) {
                        _self.opts.success(data);
                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);   //取消页码
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    }
                })
            } else {
                 $.ajax({
                    type: _self.opts.type,
                    data: $.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                       
                    }),
                    dataType: _self.opts.dataType,
                    url: _self.opts.url,
                    beforeSend: function () {
                        _self.opts.beforeSend();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data) {
                        _self.opts.success(data);

                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    },
                    complete: function () {
                        _self.opts.complete();
                    }
                });
            }
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.length);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.page == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.page - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.page == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.page + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            /*
                前：当前页 > 偏移量 + 至少保留 + 1
                后：当前页 < 总页码 - 偏移量 - 至少保留
            */

            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            /*页码*/
            if (_self.opts.page > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.page - _self.opts.shiftingLeft; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.page, 'current'));

            if (_self.opts.page <= shiftingRightStart) {

                for (i = _self.opts.page + 1; i < _self.opts.page + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.page + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }
            _self.pagerElement.html(stringFormat(_self.commonHtmlText.rightHtml, _self.opts.length, _self.opts.totalPage,_self.opts.totalCount,_self.opts.page,_self.opts.page)).append(pageText).append(_self.commonHtmlText.buttonHtml).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return stringFormat(_self.commonHtmlText.pageHtml, index, _self.opts.length, JSON.stringify(_self.opts.searchParam), text);
        },
        // keyDownJump: function (e) {
        //     if ( e.which === 13 ) {
        //         e.preventDefault();
        //         tablePager.jumpToPage();
        //         return false;
        //     }
        // },
        jumpToPage: function () {
            var _self = this;
            var $txtToPager = $("#txtToPagerThree", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.length, _self.opts.searchParam);
            } else {
                $txtToPager.focus();
            }
        }
    }
    $(document).on("keydown" , "#txtToPagerThree", function (e) {
        if ( e.which === 13 ) {
                e.preventDefault();
                tablePagerThree.jumpToPag();
                return false;
            }
    })

    $.fn.tablePagerThree = function (option) {
        return tablePagerThree.init($(this),option);
    };


    var tablePagerOne = window.tablePager3 = {
        opts: {
            length: 4,
            preText: "上一页",
            nextText: "下一页",
            firstText: "",
            lastText: "",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: false,
            showLast: false,
            loadTarget:null,
            url: "",
            type: "GET",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            // pagerElement:null,  //当该DOM元素还没加载出现时，需要添加
            error: function() {
                alert("抱歉,请求出错,请重新请求！");
            },

            page: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0} pager-btn'>{1}</span>",
            pageHtml: "<a class='pager-btn' href='javascript:void(0)' onclick='tablePager3.doPage({0},{1},{2})'>{3}</a>",
            rightHtml: "<span class='text'>每页 {0} 条记录， 共 {1} 页 {2} 条记录，当前第 {3} 页</span>",
            buttonHtml:"<input type='text' id='txtToPagerOne' /><button id='btnJump' onclick='tablePager3.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both; class='pager-btn'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;
            _self.opts = $.extend({}, _self.opts, op);
             _self.pagerElement = obj;
            _self.doPage(_self.opts.page, _self.opts.length, _self.opts.searchParam);

            return _self.opts;
        },
        doPage: function (index, length, searchParam) {
            var _self = this;

            _self.opts.page = index;
            _self.opts.length = length;
            _self.opts.searchParam = searchParam;
            //判断有没封装ajax
            if ($()._Ajax) {
                $($.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                        
                }))._Ajax({
                    type: _self.opts.type,
                    dataType: _self.opts.dataType,
                    loadTarget:_self.opts.loadTarget,
                    url: _self.opts.url,
                    success: function (data) {
                        _self.opts.success(data);
                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);   //取消页码
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    }
                })
            } else {
                 $.ajax({
                    type: _self.opts.type,
                    data: $.extend(_self.opts.searchParam || {}, {
                        page: _self.opts.page,
                       limit: _self.opts.length || 10
                       
                    }),
                    dataType: _self.opts.dataType,
                    url: _self.opts.url,
                    beforeSend: function () {
                        _self.opts.beforeSend();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                    },
                    success: function (data) {
                        _self.opts.success(data);

                        //后台返回数据格式
                        _self.opts.totalCount = data.data.totalCount;
                        _self.getTotalPage();
                        if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                            var pageTextArr = new Array;
                            _self.createPreAndFirstBtn(pageTextArr);
                            // _self.createIndexBtn(pageTextArr);
                            _self.createNextAndLastBtn(pageTextArr);
                            _self.renderHtml(pageTextArr);
                        }
                    },
                    complete: function () {
                        _self.opts.complete();
                    }
                });
            }
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.length);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.page == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.page - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.page == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.page + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            /*
                前：当前页 > 偏移量 + 至少保留 + 1
                后：当前页 < 总页码 - 偏移量 - 至少保留
            */

            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            /*页码*/
            if (_self.opts.page > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.page - _self.opts.shiftingLeft; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.page, 'current'));

            if (_self.opts.page <= shiftingRightStart) {

                for (i = _self.opts.page + 1; i < _self.opts.page + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.page + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }
            _self.pagerElement.html(stringFormat(_self.commonHtmlText.rightHtml, _self.opts.length, _self.opts.totalPage,_self.opts.totalCount,_self.opts.page,_self.opts.page)).append(pageText).append(_self.commonHtmlText.buttonHtml).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return stringFormat(_self.commonHtmlText.pageHtml, index, _self.opts.length, JSON.stringify(_self.opts.searchParam), text);
        },
        // keyDownJump: function (e) {
        //     if ( e.which === 13 ) {
        //         e.preventDefault();
        //         tablePager.jumpToPage();
        //         return false;
        //     }
        // },
        jumpToPage: function () {
            var _self = this;
            var $txtToPager = $("#txtToPagerOne", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.length, _self.opts.searchParam);
            } else {
                $txtToPager.focus();
            }
        }
    }
    $(document).on("keydown" , "#txtToPagerOne", function (e) {
        if ( e.which === 13 ) {
                e.preventDefault();
                tablePagerOne.jumpToPage();
                return false;
            }
    })

    $.fn.tablePagerOne = function (option) {
        return tablePagerOne.init($(this),option);
    };


})(window, jQuery);
var msgDetail = function () {
   $('#getcaseDeatil-modal').remodal();
    /*拇指图弹出*/
    function showDataDetailDialog2(obj){
        $(".getcaseDeatil-form").html("");
         
        var infoByCaseId = obj;
        $({})._Ajax({
            url: "usernotice/api/info/"+infoByCaseId,
            success: function (result) {
                    if (result.code==0) {

                            if (result.userNotice) {
                                var content = result.userNotice.content;
                                var dd=content.replace(/<\/?.+?>/g,"");
                                var dds=dd.replace(/ /g,"");//dds为得到后的内容
                                
                                $(".getcaseDeatil-form").html(dds);     
                                $(".getService-title-btn").text(result.userNotice.noticeTitle);
                            }       
                           
                    }
            
            }

    }); 
        }
    return {
        init: function () {
          
            },
            showDataDetailDialog2:showDataDetailDialog2,
    }
} ();
msgDetail.init();
var msgSytem = (function() {
  function getMycase(){ 
    var params = {
      loginUserId:userid
    }
  $('#my-cases .pager').tablePager({
      url: "usernotice/api/list",
      searchParam:params,
      success: function (result) {
              if (result.code==0) {
             
                if (result) {
                  
                    var html = template("systemNews-result-templete",result.data)
            
                    $("#content1read").html(html); 
                    if(result.data.totalCount<10){
                        $(".page-row").hide()
                    }else{
                        $(".page-row").show()
                    }
                    if(result.data.totalCount==0){
                        $("#content1read").html("<P class='noresult'>抱歉，没有系统消息</P>")
                    }
                    }else{
                        toastr.warning(result.msg);
                    }
                 
                }

      }
 })
}
 function getnoReadMycase(){ 
  var params = {
    loginUserId:userid,
    isRead:0
  }
$('#my-cases .pager').tablePager({
    url: "usernotice/api/list",
    searchParam:params,
    success: function (result) {
            if (result.code==0) {
           
              if (result) {
                
                  var html = template("systemNews-result-templete",result.data)
          
                  $("#content1read").html(html); 
                  if(result.data.totalCount<10){
                      $(".page-row").hide()
                  }else{
                      $(".page-row").show()
                  }
                  if(result.data.totalCount==0){
                      $("#content1read").html("<P class='noresult'>抱歉，没有系统消息</P>")
                  }
                  }else{
                      toastr.warning(result.msg);
                  }
               
              }

    }
})
 
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
      getMycase()
     
    $(document).on("click",".hadread",function(){
      var dataid = $(this).attr("dataid");
      $("#"+dataid).addClass("hadreadicon");
     
      $({})._Ajax({
        url: "usernotice/api/update/"+dataid,
        success: function (result) {
                if (result.code==0) {
                   
                }
             }
            });
    })
    $(document).on("click",".setReaded",function(){
      var ids = $(this).attr("dataid");
      var megdiv = $("#content1read .messages-item");
      console.log(megdiv)
      var ids =[];
      for(var i=0;i<megdiv.length;i++){
        console.log(megdiv[i].id)
        ids += megdiv[i].id+",";
      }
      ids = ids +"]";
      var idss = ids.replace(",]","");
      console.log(idss)
      $({ids:idss})._Ajax({
        url: "usernotice/api/batchUpdate/",
        success: function (result) {
                if (result.code==0) {
                  location.reload();
                }
             }
        });
      });
      
      $(document).on("click",".del",function(){
        var id = $(this).attr("dataid");
        $({})._Ajax({
          url: "usernotice/api/delete/"+id,
          success: function (result) {
                  if (result.code==0) {
                    location.reload();
                  }
               }
          }); 
      })
      $(document).on("click",".label-right",function(){
        getnoReadMycase();
         
      })
    
      $(document).on("click",".label-left",function(){
        getMycase();
         
      })
      $(document).on("click",".msg-detail-btn",function(){
                
        msgDetail.showDataDetailDialog2($(this).attr("data-id"))
   
})
    }
  }
})()
msgSytem.init()
