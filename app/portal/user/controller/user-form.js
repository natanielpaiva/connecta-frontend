define([
    'connecta.portal',
    'portal/layout/service/notify',
    'portal/user/service/user-service',
    'portal/layout/service/data-uri'
], function (portal) {

    return portal.lazy.controller('UserFormController', function ($scope, $translate,
            notify, UserService, LoginService, dataURI) {

        function init() {
            $scope.user = {};
            $scope.credentials = {};
            $scope.rejFiles = {};
            $scope.languages = {
                'pt-br': 'Português (Brasil)',
                'en-us': 'English (US)'
            };

            $scope.$watch('user.language', function (lang) {
                $translate.use(lang);
            });

            $scope.$watch('image', function () {
                if ($scope.image) {
                    $scope.imageURL = $scope.image;
                } else {
                    $scope.imageURL = UserService.makeBackgroundImage($scope.user.id);
                }
            });

            LoginService.getCurrentUser().then(function (data) {
                $scope.user = data;

                if (!$scope.user.language) {
                    $scope.user.language = 'pt-br';
                }

                $scope.imageURL = UserService.makeBackgroundImage($scope.user.id);
            });
        }

        $scope.createUser = function () {
            UserService.save($scope.user).then(function (result) {
                console.log(result);
            });
        };

        $scope.fileDropped = function ($files) {
            $scope.imageFile = $files[0];
            dataURI($scope.imageFile).then(function (result) {
                $scope.image = result;
            });
        };

        $scope.removePhoto = function () {
            UserService.upload(null, $scope.user).then(function () {
                $scope.image = null;
                $scope.imageFile = null;
            });
        };

        $scope.submitUserProfile = function () {
            UserService.update($scope.user).then(function () {
                if ($scope.imageFile) {
                    UserService.upload($scope.imageFile, $scope.user).then(function () {
                        $translate('USER.UPDATE_SUCCESS').then(function (text) {
                            notify.success(text);
                        });
                    });
                } else {
                    $translate('USER.UPDATE_SUCCESS').then(function (text) {
                        notify.success(text);
                    });
                }
            });
        };

        $scope.submitCredentials = function () {
            UserService.changePassword($scope.credentials).then(function () {
                $translate('USER.CHANGE_PASSWORD_SUCCESS').then(function (text) {
                    notify.success(text);
                });
            });
        };

        init();
    });

});
