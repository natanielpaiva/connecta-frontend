define([
    'connecta.inspection',
], function (inspection) {

    return inspection.directive('dropFile', function () {
        return {
            restrict: 'E',
            controller: function ($scope) {
                $scope.fileDropped = function (files) {
                    var file = null;
                    if (files && files.length) {
                        file = files[0];
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            var document = $scope.createDocument(file);
                            $scope.setImageFile(document, event);
                            var index = $scope.files.indexOf(file);
                            if (index === -1) {
                                $scope.files.push(file);
                                $scope.documents.push(document);
                                $scope.$apply();
                            }
                        };
                        reader.readAsDataURL(files[0]);
                    }
                };

                $scope.removeFile = function (document) {
                    for (var i in $scope.files) {
                        if ($scope.files[i].name === document.name) {
                            $scope.files.splice(i, 1);
                        }
                    }
                    var index = $scope.documents.indexOf(document);
                    $scope.documents.splice(index, 1);
                };

                $scope.setImageFile = function (document, event) {

                    var setImage = function () {
                        if (event === null) {
                            document.image = document.document;
                        } else {
                            document.image = event.target.result;
                        }
                    };

                    switch (document.extension) {
                        case "DOCX":
                            document.image = "assets/img/inspection/file-word-o.png";
                            break;

                        case "PPT":
                            document.image = "assets/img/inspection/file-excel-o.png";
                            break;

                        case "TXT":
                            document.image = "assets/img/inspection/file-text-o.png";
                            break;

                        case "JPG":
                            setImage();
                            break;

                        case "PNG":
                            setImage();
                            break;
                    }
                };

                $scope.createDocument = function (file) {
                    var type = file.name.split('.');
                    type = type[type.length - 1];

                    return {
                        name: file.name,
                        extension: type.toUpperCase(),
                        description: file.name,
                        type: $scope.type
                    };
                };

                $scope.isImage = function (file) {
                    if ((file.extension === "JPG") || (file.extension === "PNG")) {
                        return true;
                    }

                    return false;
                };

            },
            scope: {
                files: "=",
                documents: "=",
                type:"@"
            },
            link: function ($scope) {
                var unbindWatcher = $scope.$watch('documents', function (value) {
                    if ($scope.documents.length > 0) {
                        for (var i in $scope.documents) {
                            $scope.setImageFile($scope.documents[i], null);
                        }
                        unbindWatcher();
                    }
                });
            },
            templateUrl: 'app/inspection/inspection/directive/template/drop-file.html'
        };
    });
});