define([], function() {
    return function ObieeAnalysisFormController($scope) {
     //  alert("Obiee");
       
               $scope.getCatalog = function (scope, item) {
            scope.toggle();
            var IdDatosource = $scope.analysis.datasource.id;

            //muda o icon para uma pasta aberta
            scope.$modelValue.icon = "glyphicon glyphicon-folder-open";

            //caso seja uma pasta
            if (item.type === "folder") {
                return AnalysisService.getListCatologBiee(IdDatosource, item.path).then(function (response) {
                    item.items = response.data;

                    for (var it in item.items) {

                        if (item.items[it].type === "folder") {
                            item.items[it].icon = "glyphicon glyphicon-folder-close";
                        }
                        if (item.items[it].type === "object") {
                            item.items[it].icon = "glyphicon glyphicon-signal";
                        }
                    }
                });
            } else if (item.type === "object") {
                return AnalysisService.getListColumnsObiee(IdDatosource, item.path).then(function (response) {
                    $scope.component.columns = response.data;
                });
            }
        };
    };
});
