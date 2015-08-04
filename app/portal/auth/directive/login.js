define([
  'connecta.portal',
  'portal/auth/service/login-service'
], function(portal) {
  return portal.directive('login', function() {
    return {
      templateUrl:'app/portal/auth/directive/template/login.html',
      controller:function($scope, LoginService) {
        $scope.credentials = {};
        
        LoginService.checkAuthentication();

        $scope.submit = function() {
          LoginService.doLogin($scope.credentials);
        };
      }
    };
  });
});
