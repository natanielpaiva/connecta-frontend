define([
     'connecta.presenter',
     'presenter/group/service/group-service'
], function(presenter) {
     return presenter.lazy.controller('GroupViewController', function($scope, GroupService, $routeParams, $location, fileExtensions) {

          GroupService.getById($routeParams.id).then(function(response) {

               $scope.group = response.data;
               if (response.data.query === undefined) {
                    GroupService.getGroupBySingleSourceId($scope.group.id)
                         .then(function(response) {

                              var singleSourceGroup = response.data.singleSourceGroup;
                              $scope.group.singleSource = [];
                              for (var indice in singleSourceGroup) {
                                   $scope.group.singleSource[singleSourceGroup[indice].numOrder] = {};
                                   $scope.group.singleSource[singleSourceGroup[indice].numOrder]
                                        .path = GroupService.getFileById(
                                             singleSourceGroup[indice].singleSource.id);

                                   $scope.group.singleSource[singleSourceGroup[indice].numOrder]
                                        .name = singleSourceGroup[indice].singleSource.name;

                                   $scope.group.singleSource[singleSourceGroup[indice].numOrder]
                                        .fileType = fileExtensions[singleSourceGroup[indice]
                                             .singleSource.fileType].fileType;
                              }
                         }, function(response) {
                              console.log(response);
                         });

               } else {
                    GroupService.getQueryById(response.data.query.id).
                    success(function(data, status, headers, config) {
                         $scope.query = GroupService.formatQueryBuiderEdit(data);
                         $scope.predicateMap = GroupService.getPredicate();
                         $scope.operatorMap = GroupService.getOperator();
                         $scope.getResultQueryBuider($scope.query);

                    }).
                    error(function(data, status, headers, config) {

                    });
               }


               $scope.excluir = function(id) {
                    GroupService.delete(id).then(function(response) {
                         $location.path('presenter/group');
                    }, function(response) {

                    });
               };

               var getSingleSourceByQueryBuilder = function(data) {
                    $scope.medias = [];
                    for (var i in data) {
                         $scope.medias.push({
                              "url": GroupService.getFileById(data[i].id),
                              "name": data[i].name
                         });
                    }
               };

               $scope.getResultQueryBuider = function(query) {
                    if ($routeParams.id) {
                         GroupService.getResultQueryBuilder(query, true).
                         success(function(data, status, headers, config) {
                              getSingleSourceByQueryBuilder(data);
                         }).
                         error(function(data, status, headers, config) {

                         });
                    } else {
                         GroupService.getResultQueryBuilder(query, false).
                         success(function(data, status, headers, config) {
                              getSingleSourceByQueryBuilder(data);
                         }).
                         error(function(data, status, headers, config) {

                         });
                    }


               };

          });

     });
});