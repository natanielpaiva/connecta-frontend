/**
 * @param {files} Array que os objetos de Imagem irão ficar
 * @param {documents} Array de objectos Documents
 * @param {filesType} Tipos de file que serão aceitos
 * @param {type} Tipo do documento
 * @param {isSingle} true se for possível adicionar apenas um arquivo
 */

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
                            if ($scope.isSingle) {
                                $scope.files[0] = file;
                                $scope.documents[0] = document;
                            } else if (index === -1) {
                                $scope.files.push(file);
                                $scope.documents.push(document);
                            }
                            $scope.$apply();

                            if ($scope.callback) {
                                $scope.callback.apply();
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
                    var images = ['JPG', 'PNG'];
                    return images.indexOf(file.extension) > -1;
                };

            },
            scope: {
                files: "=",
                documents: "=",
                type: "@",
                filesType: "@",
                isSingle: "@",
                callback: '='
            },
            link: function ($scope) {
                if ($scope.documents === undefined) {
                    $scope.documents = [];
                }
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