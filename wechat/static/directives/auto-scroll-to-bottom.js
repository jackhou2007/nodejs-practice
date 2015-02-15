// 定義自動滾動屬性
angular.module('wechatApp').directive('autoScrollToButton', function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return element.children().length;
            }, function () {
                element.animate({
                    scrollTop: element.prop('scrollHeight')
                }, 1000);
            });
        }
    };
});