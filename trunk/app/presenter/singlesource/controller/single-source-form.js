define([
    'connecta.presenter',
    'presenter/singlesource/service/singlesource-service'
], function (presenter) {
    return presenter.lazy.controller('SingleSourceFormController', function ($scope, SingleSourceService, $routeParams, $location, fileExtensions) {

        $scope.myFiles = [];
        $scope.types = SingleSourceService.getTypes();
        $scope.optionsAttributeTypes = SingleSourceService.getAttributeTypes();
        $scope.typeSingleSource = {};
        $scope.file = "";
        $scope.fileExtensions = "";

        $scope.getAttributes = function (val) {
            return SingleSourceService.getAttribute(val);
        };

        $scope.closeFile = function () {
            $scope.typeSingleSource.path = "";
        };

        if ($routeParams.id) {

            $scope.typeSingleSource.type = $scope.types[0];
            SingleSourceService.getById($routeParams.id).then(function (response) {
                var type = $scope.types.filter(function (value) {
                    return value.id.toUpperCase() === response.data.type;
                }).pop();

                $scope.typeSingleSource = response.data;
                $scope.typeSingleSource.type = type;
                $scope.typeSingleSource.path = SingleSourceService.getFileById($routeParams.id);

                if ($scope.typeSingleSource.singleSourceAttributes.length === 0) {
                    $scope.typeSingleSource.singleSourceAttributes = [
                        {
                            attribute: "",
                            value: ''
                        }
                    ];
                } else {
                    for (var key in $scope.typeSingleSource.singleSourceAttributes) {

                        var value = 0;
                        for (var v in $scope.optionsAttributeTypes) {
                            if ($scope.optionsAttributeTypes[v].label === $scope.typeSingleSource.singleSourceAttributes[key].attribute.type)
                                value = v;
                        }

                        $scope.typeSingleSource.singleSourceAttributes[key].attributeType = $scope.optionsAttributeTypes[value];
                    }
                }

                if ($scope.typeSingleSource.fileType !== undefined) {
                    $scope.fileExtensions = fileExtensions[$scope.typeSingleSource.fileType];
                }

            });
        } else {
            $scope.typeSingleSource.path = "";
            $scope.typeSingleSource.type = $scope.types[0];
            $scope.attributeType = $scope.optionsAttributeTypes[0];

            /**
             * Parâmetros do singleSourceAttributes
             */
            $scope.typeSingleSource.singleSourceAttributes = [{}];
        }

        $scope.fileDropped = function (files) {
            if (files && files.length) {
                $scope.file = files[0];
                $(".set-file").html($scope.file.name);
            }
        };

        $scope.submit = function () {

            if ($scope.typeSingleSource.type.id === "FILE") {
                if ($scope.file !== "") {
                    $scope.typeSingleSource.type = "FILE";
                    $scope.typeSingleSource.filename = $scope.file.name;

                    SingleSourceService.save($scope.file, $scope.typeSingleSource).then(function () {
                        $location.path('presenter/singlesource');
                    }, function (response) {
                    });
                } else {
                    $scope.typeSingleSource.type = "FILE";
                    SingleSourceService.save($scope.file, $scope.typeSingleSource).then(function () {
                        $location.path('presenter/singlesource');
                    }, function (response) {
                    });
                }
            } else {
                if ($scope.typeSingleSource.id) {
                    SingleSourceService.updateUrl($scope.typeSingleSource).then(function () {
                        $location.path('presenter/singlesource');
                    }, function (response) {
                    });
                } else {
                    $scope.typeSingleSource.urlType = "url";
                    SingleSourceService.saveUrl($scope.typeSingleSource).then(function () {
                        $location.path('presenter/singlesource');
                    }, function (response) {
                    });
                }
            }

        };

        $scope.change = function () {
            for (var key in $scope.typeSingleSource.singleSourceAttributes) {

                var value = "";
                for (var v in $scope.optionsAttributeTypes) {
                    if ($scope.optionsAttributeTypes[v].label === $scope.typeSingleSource.singleSourceAttributes[key].attribute.type)
                        value = v;

                    if (value !== "")
                        $scope.typeSingleSource.singleSourceAttributes[key].attributeType = $scope.optionsAttributeTypes[value];
                }
            }
        };
    });
});