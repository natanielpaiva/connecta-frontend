define([
  'angular',
  'connecta.portal'
], function(angular, portal){

  return portal.directive('headingPopover', function(){
    return {
      restrict: 'E',
      templateUrl: 'app/portal/layout/directive/template/heading-popover.html',
      // replace: true,
      // scope: {},
      link: function($scope, el, attr){

        el.click(function (e) {
          var pop = el.children('.heading-popover');
          if (e.offsetX > pop.width() || e.offsetY > pop.height() ||
            e.offsetX < 0 || e.offsetY < 0 ) {

            $scope.closePopover();
          }
        });
      },
      controller: function($scope, $timeout){
        $scope.popover = {
          controller: function($scope) {},
          templateurl: null
        };

        $scope.popOverActive = false;

        $scope.closePopover = function(){
          $timeout(function() {
            $scope.closeCallback();
            $scope.popover = null;
            $scope.popOverActive = false;
           });
        };

        $scope.showPopOver = function(options){
          if($scope.popover && $scope.popover.id &&
              ($scope.popover.id === options.id)){

            $scope.closePopover();
            return;
          }

          $scope.closeCallback();
          $scope.popover = null;
          $scope.popover = options;
          $scope.popOverActive = true;
        };

        $scope.closeCallback = function(){
          $scope.popover && $scope.popover.close && $scope.popover.close($scope.popover); // jshint ignore:line
        };

        $scope.$on('popover.activate', function(e, options){
          $scope.showPopOver(options);
        });

        $scope.$on('popover.hide', function(e, options){
          $scope.closePopover();
        });
      }
    };
  });
});
