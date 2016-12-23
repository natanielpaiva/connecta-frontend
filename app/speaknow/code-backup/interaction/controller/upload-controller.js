define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service'
], function (speaknow) {
    return speaknow.lazy.controller('UploadController', function ($scope, InteractionService, $location, $routeParams) {

        $scope.submit = function () {

            var company = {
                name:'Hipermercado Extra',
                user: {id:18},
                type:'Mercado',
                address: 'Brasília',
                mail:'extra@extra.com.br',
                percentPositive: 85,
                phone: "(31) 33225544",
                percentNegative: 15
            };

            InteractionService.upload($scope.file, company).then(function () {
                $location.path('speaknow/interaction');
            }, function (response) {
            });
        };

        $scope.fileDropped = function (files) {
            if (files && files.length) {
                $scope.file = files[0];
                $(".set-file").html($scope.file.name);
            }
        };
    });
});