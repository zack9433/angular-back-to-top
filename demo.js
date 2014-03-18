'use strict';

angular.module('DemoApp', ['zkNotify'])
  .controller('DemoCtrl', ['$scope', 'zkNotifySrv', function($scope, zkNotifySrv) {
    zkNotifySrv.setNotifyMsg('this is global message');
    $scope.msg = "hello world";
    $scope.msg2 = "test";
  }]);
