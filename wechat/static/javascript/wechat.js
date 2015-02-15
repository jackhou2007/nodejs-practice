angular.module('wechatApp', []);

// 封裝socket
angular.module('wechatApp').factory('socket', function ($rootScope) {
    // var socket = io.connect('/');
    var socket = io();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});

// RoomCtrl
angular.module('wechatApp').controller('RoomCtrl', ['$scope', 'socket', function($scope, socket){
    $scope.messages = [];
    socket.emit('getAllMessages');
    socket.on('allMessages', function (messages) {
        $scope.messages = messages;
    }),
    socket.on('messageAdded', function (message) {
        $scope.messages.push(message);
    });
}]);

// Creator
angular.module('wechatApp').controller('MessageCreatorCtrl', ['$scope', 'socket', function($scope, socket){
    $scope.newMessage = '';
    $scope.createMessage = function () {
        if ($scope.newMessage == '') {
            return;
        }
        socket.emit('createMessage', $scope.newMessage);
        $scope.newMessage = '';
    }
}]);

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

// 定義分行快捷鍵
angular.module('wechatApp').directive('ctrlEnterBreakLine', function () {
    return function (scope, element, attrs) {
        var ctrlDown = false;
        element.on('keydown', function (e) {
            if (e.which == 17) {
                ctrlDown = true;
                setTimeout(function () {
                    ctrlDown = false;
                }, 1000);
            }

            if (e.which == 13) {
                if (ctrlDown) {
                    element.val(element.val() + '\n');
                } else {
                    scope.$apply(function () {
                        scope.$eval(attrs.ctrlEnterBreakLine);
                    });

                    e.preventDefault();
                }
            }
        })
    };
});