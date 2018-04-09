/**
 * 使用说明：
 * $.fn.drag.init({
 *     item: []， // 数组
 *     radius: '' , // 按钮半径
 *     container: '' // 容器
 * })
 */
import 'assets/common';
(function ($) {
    $.fn.extend({
        drag: {
            init: async function (obj) {
                this.item = obj.item;
                this.container = obj.container;
                this.radius = obj.radius || '50px';
                await this.createElements();
                this.btn = $("#drag-btn")
                this.arrLeft = [];
                await this.createItem();
                // 起始点横坐标
                this.barOffSetX = $(".bar")[0].offsetLeft
                // 每段长度
                this.dis = $(".bar").width() / (this.item.length - 1)
                this.computeStyle();
                this.barItem = $('.bar em')
                this.bntDrag();
                this.clickItem();
            },
            createElements: function() {
                this.container.html(`<div class="bar"></div><em class="drag-btn" id="drag-btn"></em>`)
                this.container.css({
                    'width': '100%',
                    'height': '106px',
                    'background': '#f1f1f1',
                    'position': 'relative',
                    'padding-top': '70px'
                })
                $('.bar').css({
                    'width': '270px',
                    'height': '10',
                    'border': '1px solid #f2f6fa',
                    'background': '#E6E6E6',
                    'position': 'relative',
                    'border-radius': '10'
                })
                $(".drag-btn").css({
                    'width': this.radius,
                    'height': this.radius,
                    'border-radius': '50%',
                    'background': '#ededed',
                    'box-shadow': '0 0 1px 1px rgba(0,0,0, .1)',
                    'bottom': '7px',
                    'left': '28.5px',
                    'position': 'absolute',
                    'transform': 'translate3d(0,0,0)',
                    '-webkit-transform': 'translate3d(0,0,0)',
                    'z-index': '99',
                    'transition': '.2s'
                })

            },
            /* 根据item创建页面标签 */
            createItem: function () {
                let _frag = document.createDocumentFragment();
                let _fragSpan = document.createDocumentFragment();
                for (let i = 0; i < this.item.length; i++) {
                    $(_frag).append(`<em style="position: absolute;top: -7px;border-radius: 50%;
                        height: 20px;
                        width: 20px;
                        background: #E6E6E6;
                        content: "";
                        border: 1px solid #f2f6fa;
                        z-index: 90;"></em>`);
                    $(_fragSpan).append(`<span style="position: absolute;text-align: center;transition: .5s;
                    -webkit-transform: translate3d(0, -55px, 0);transform: translate3d(0, -55px, 0);" class="text${i}">${this.item[i]}</span>`)
                }
                $('.bar').append(_frag)
                $('.service-box').append(_fragSpan)
            },
            /* 计算span 和 em 的落脚点 */
            computeStyle: function () {
                let $span = $('.service-box span');
                let $em = $('.bar em');
                let spanArr = $('.service-box').find('span');
                let emArr = $('.bar').find('em');
                for (let i = 0; i < spanArr.length; i++) {
                    spanArr[i].style.left = this.barOffSetX - $span.eq(i).width() / 2 + i * this.dis + 'px';
                    emArr[i].style.left = this.dis * i - $em.eq(i).width() / 2 + 'px';
                    emArr[i].style.borderLeft = 'none';
                    emArr[i].style.borderRight = 'none';
                }
                emArr[0].style.borderRight = 'none';
                emArr[emArr.length - 1].style.borderLeft = 'none';
                let that = this;
                this.arrLeft = $em.map(function (index, item) {
                    return that.getLeft(item);
                })
            },
            /* 拖动按钮 */
            bntDrag: function () {
                let that = this;
                this.btn.on('touchmove', function () {
                    let moveX = event.targetTouches[0].clientX - $(this).width();
                    if (moveX < 0 || moveX > $(".bar").width()) {
                        return
                    }
                    that.btn.css({
                        'transform': 'translate3d(' + moveX + 'px, 0, 0)',
                        '-webkit-transform': 'translate3d(' + moveX + 'px, 0, 0)'
                    })
                    let btnSetLeft = event.targetTouches[0].clientX;
                    that.compareDistance(btnSetLeft, true);
                });
                this.btn.on('touchend', function (e) {
                    let moveX = e.originalEvent.changedTouches[0].clientX - $(this).width();
                    if (moveX < 0 || moveX > $(".bar").width()) {
                        return
                    }
                    let btnSetLeft = e.originalEvent.changedTouches[0].clientX;
                    that.compareDistance(btnSetLeft)
                })
            },
            /* 点击条目 */
            clickItem: function () {
                let that = this;
                $('.bar em').on('click', function () {
                    that.moveDistance($(this).index());
                })
            },
            /* 按钮最终落的位置和文字效果 */
            moveDistance: function (item, end) {
                !end && this.btn.css({
                    'transform': 'translate3d(' + this.dis * item + 'px, 0, 0)',
                    '-webkit-transform': 'translate3d(' + this.dis * item + 'px, 0, 0)'
                })
                $('.text' + item).css({
                    'color': '#42babb',
                    '-webkit-transform': 'translate3d(0, -65px, 0)',
                    'transform': 'translate3d(0, -65px, 0)'
                }).siblings('span').css({
                    'color': 'inherit',
                    '-webkit-transform': 'translate3d(0, -55px, 0)',
                    'transform': 'translate3d(0, -55px, 0)'
                })
            },
            /* 获取目标元素的横坐标 */
            getLeft: function (e) {
                var offset = e.offsetLeft;
                if (e.offsetParent != null) offset += this.getLeft(e.offsetParent);
                return offset;
            },
            /* 思路： 获取每个点的横坐标，然后释放按钮时，取按钮的横坐标，差值大于0且小于每段宽度的1/2，就是离那个点最近*/
            compareDistance: function (btnSetLeft, end) {
                for (let i = 0; i < this.arrLeft.length; i++) {
                    let distance = Math.abs(btnSetLeft - this.arrLeft[i]);
                    if (distance > 0 && distance < this.dis / 2) {
                        this.moveDistance(i, end);
                    }
                }
            }
        }

    })
})(window.jQuery)
