require([
    'connecta.portal'
], function(portal){
    return portal.controller('HomeController', function($scope, $translate){
        $scope.setLang = function(lang) {
            $translate.use(lang);
        };
        
        $scope.types = [
            {
                id:'database',
                name:'Database',
                template:'_datasource-database.html'
            },
            {
                id:'webservice',
                name:'WS',
                template:'_datasource-webservice.html'
            },
            {
                id:'endeca',
                name:'Endeca',
                template:'_datasource-endeca.html'
            },
            {
                id:'solr',
                name: 'SOLR',
                template:'_datasource-solr.html'
            }
        ];
        
        $scope.datasource = {
            type:$scope.types[0]
        };
    });
});