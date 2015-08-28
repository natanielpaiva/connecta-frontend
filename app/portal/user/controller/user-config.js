define([
  'connecta.portal',
  'portal/layout/service/notify',
  'portal/user/service/user-service'
], function(portal){

  return portal.lazy.controller('UserConfigController', function($scope, notify, UserService, LoginService){

    LoginService.getCurrentUser().then(function(data){
      $scope.user = data;
      console.log(data);
    });


    $scope.onFileSelected = function (files) {
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
      UserService.updateUser($scope.user, $scope.fileImage).then(function(response){
        console.log(response);
      });
      // if (!$scope.user.id) {
      //   var image = $scope.user.image;
      //   delete $scope.user.image;

      //   InteractionService.save($scope.user, image).success(function (response) {
      //     $location.path('/speaknow/interaction/' + response.id);
      //   });
      // }
    };
  });

});
