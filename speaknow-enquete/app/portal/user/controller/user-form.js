define([
  'connecta.portal',
  'portal/layout/service/notify',
  'portal/user/service/user-service'
], function(portal){

  return portal.lazy.controller('UserFormController', function($scope, $translate, $location, notify, UserService, LoginService){

    $scope.onFileSelected = function (files, ev, rejFiles) {
      if (rejFiles && rejFiles.length) {
        $translate('USER.VALIDATION.INVALID_DOCUMENT').then(function (text) {
          notify.warning(text);
        });
        return;
      }

      var file = files[0];
      $scope.fileImage = file;
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          if($scope.validateImage(e)){
              $scope.userImage = e.target.result;
              $scope.imgName = file.name;
              $scope.$apply();
          } else {
              $scope.removeUserImg();
          }
        };
        reader.readAsDataURL(files[0]);
      }
    };

    $scope.removeUserImg = function(){
      $scope.userImage = null;
      $scope.imgName = null;
      $scope.fileImage = null;
    };

    $scope.validateImage = function(image){
      var isValid = true;
      if(image.total / 614400 > 1){
        notify.warning("USER.VALIDATION.IMAGESIZE");
        isValid = false;
      } else {
        var img = angular.element("<img>")[0];
        img.src = image.target.result;
        if(img.height != img.width){
          notify.warning("USER.VALIDATION.IMAGEFORM");
          isValid = false;
        }
      }
      return isValid;
    };

    $scope.submit = function () {
      //Por enquanto o login do usuário será o email (easy unique...)
      $scope.user.profile.id = $scope.user.profile.email;

      UserService.save($scope.user, $scope.fileImage).then(function(response){
        LoginService.setAuthenticatedUser(response);
        $location.path('/');
        console.log(response);
      });
    };
  });
});
