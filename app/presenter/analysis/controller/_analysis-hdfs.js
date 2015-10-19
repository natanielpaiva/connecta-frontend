define([], function() {
    return function HdfsAnalysisFormController($scope) {
        alert("HDFS");
        
        
         $scope.typeQuery = [
            {value: "hiveQL", name: "HiveQL"},
            {value: "pigQuery", name: "PigQuery"}
        ];
    };
});
