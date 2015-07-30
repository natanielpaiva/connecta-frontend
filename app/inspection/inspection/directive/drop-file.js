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
                            var document = $scope.createDocument(file, event);
                            $scope.setImageFile(document);
                            var index = $scope.files.indexOf(file);
                            if (index === -1) {
                                $scope.files.push(document);
                                $scope.$apply();
                            } else {
                                notify.warning("O documento já está na lista de documentos.");
                            }
                        };
                        reader.readAsDataURL(files[0]);
                    }
                };

                $scope.removeFile = function (file) {
                    var index = $scope.files.indexOf(file);
                    $scope.files.splice(index, 1);
                };

                $scope.setImageFile = function (document) {
                    switch (document.type){
                        case "docx":
                            document.image = "assets/img/inspection/file-word-o.png";
                            break;
                        
                        case "ppt":
                            document.image = "assets/img/inspection/file-excel-o.png";
                            break;
                        
                        case "txt":
                            document.image = "assets/img/inspection/file-text-o.png";
                            break;
                        
                        case "jpg":
                            document.image = document.document;
                            break;
                    }
                };

                $scope.createDocument = function (file, event) {
                    var type = file.name.split('.');
                    type = type[type.length - 1];

                    return {
                        name: file.name,
                        type: type,
                        document: event.target.result
                    };
                };
                
                $scope.count = 0;
                $scope.isImage = function(file){
                    if(file.type === "jpg"){
                        return true;
                    }
                    
                    return false;
                };
            },
            scope: {
                files: "="
            },
            link: function ($scope) {
            },
            templateUrl: 'app/inspection/inspection/directive/template/drop-file.html'
        };
    });
});