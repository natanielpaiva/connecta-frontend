define([
    'connecta.presenter',
    'presenter/group/service/group-service'
], function (presenter) {
    return presenter.lazy.controller('GroupFormController', function ($scope, GroupService,
            $routeParams, $location, fileExtensions, $autocomplete,
            presenterResources, SidebarService) {

        $scope.types = GroupService.getTypeFilter();
        $scope.group = {};
        $scope.attribute = {
            name: ""
        };


        $scope.queryInit = function () {
            $scope.query = {
                statement: {
                    "type": "GROUP",
                    "operator": "OR",
                    "statements": []
                }
            };
        };

        var getSingleSourceByQueryBuilder = function (data) {
            $scope.medias = [];
            for (var i in data) {
                $scope.medias.push({
                    "url": GroupService.getFileById(data[i].id),
                    "name": data[i].name
                });
            }
        };

        $scope.getResultQueryBuider = function (query) {
            if ($routeParams.id) {
                GroupService.getResultQueryBuilder(query, true).
                        success(function (data, status, headers, config) {
                            getSingleSourceByQueryBuilder(data);
                        }).
                        error(function (data, status, headers, config) {

                        });
            } else {
                GroupService.getResultQueryBuilder(query, false).
                        success(function (data, status, headers, config) {
                            getSingleSourceByQueryBuilder(data);
                        }).
                        error(function (data, status, headers, config) {

                        });
            }


        };

        $scope.getAttributes = function (val) {
            return GroupService.getAttribute(val);
        };

        $scope.addGroup = function (stmt) {
            stmt.statements.push({
                type: 'GROUP',
                statements: []
            });
        };
        $scope.addCondition = function (stmt) {
            stmt.statements.push({
                type: 'CONDITION'
            });
        };
        $scope.remove = function (parent, stmt) {
            parent.statements.splice(
                    parent.statements.indexOf(stmt),
                    1
                    );
        };

        $scope.getSingleSources = function (value) {
            return $autocomplete(presenterResources.singlesource + "/auto-complete", {
                name: value
            }).then(function (response) {
                return response.data.map(function (item) {
                    $scope.setGallery(item);
                    return item;
                });
            });
        };

        $scope.submit = function () {

            if ($scope.group.type.id === "FILTER") {
                var queryCopy = angular.copy($scope.query);
                GroupService.saveQueryBuilder(queryCopy).
                        success(function (data, status, headers, config) {
                            $scope.group.query = {
                                "id": data.id
                            };

                            GroupService.save($scope.group).then(function (response) {
                                $location.path('presenter/group');
                            }, function (response) {
                                console.log(response);
                            });
                        }).
                        error(function (data, status, headers, config) {

                        });
            } else {
                GroupService.save($scope.group).then(function () {
                    $location.path('presenter/group');
                }, function (response) {
                    console.log(response);
                });
            }


        };

        var sidebar = function () {
            SidebarService.config({
                controller: function ($scope) {

                    $scope.setSinglesourceData = function (singlesourceData) {
                        $scope.singlesourceData = singlesourceData;
                        $scope.singlesourceList = [];
                        $scope.singlesourceList.push(singlesourceData);
                    };

                    $scope.getSinglesource = function (val) {
                        return GroupService.getSinglesourceAutoComplete(val);
                    };

                    $scope.search = {
                        name: "",
                        results: []
                    };

                    $scope.search.doSearch = function () {
                        GroupService.getSinglesourceList($scope.search.name).then(function (response) {
                            $scope.search.results = response;
                            for (var key in $scope.search.results) {
                                $scope.search.results[key].binaryFile = GroupService.getBinaryFile($scope.search.results[key]);
                            }
                        });
                    };

                    $scope.$watch('search.name', function () {
                        $scope.search.doSearch();
                    });
                },
                src: 'app/presenter/group/template/_group-sidebar.html'
            }).show();
        };


        $scope.group.singleSource = {
            selected: null,
            lists: {
                singleSourceGet: [],
                singleSourceSet: []
            }
        };

        if ($routeParams.id) {

            GroupService.getById($routeParams.id).then(function (response) {

                var typeFilterSelect = $scope.types.filter(function (value) {
                    if (response.data.type === 'SELECT') {
                        return value.id.toUpperCase() === 'SELECT';

                    } else {
                        return value.id.toUpperCase() === 'FILTER';
                    }
                }).pop();

                $scope.group.name = response.data.name;
                $scope.group.description = response.data.description;
                $scope.group.type = typeFilterSelect;
                $scope.group.id = $routeParams.id;
                if (response.data.type === 'SELECT') {
                    $scope.setEditGroup($routeParams.id);
                } else {
                    GroupService.getQueryById(response.data.query.id).
                            success(function (data, status, headers, config) {
                                $scope.query = GroupService.formatQueryBuiderEdit(data);
                                $scope.predicateMap = GroupService.getPredicate();
                                $scope.operatorMap = GroupService.getOperator();
                                $scope.getResultQueryBuider($scope.query);

                            }).
                            error(function (data, status, headers, config) {

                            });
                }
            });
        } else {
            $scope.group.type = $scope.types[0];
            $scope.group.path = "";

            $scope.predicateMap = GroupService.getPredicate();
            $scope.operatorMap = GroupService.getOperator();
            $scope.queryInit();

        }
        
        var sidebarConfig = function(){
            if ($scope.group.type.id === 'FILTER') {
                SidebarService.config({}).hide();
            } else {
                sidebar();
            }
        };
        
        $scope.$watch('group.type', function(){
            sidebarConfig();
        });
        
        $scope.$on("$locationChangeStart", function(){
            SidebarService.hide();
        });

        $scope.setGallery = function (data) {
            var indice = $scope.group.singleSource.lists.singleSourceGet.length;

            if (data.id !== undefined) {
                GroupService.getSingleSourceById(data.id)
                        .then(function (response) {
                            if (response.data.type === 'FILE') {
                                $scope.group.singleSource.lists.singleSourceGet[indice] = {};
                                $scope.group.singleSource.lists
                                        .singleSourceGet[indice].path = GroupService
                                        .getFileById(response.data.id);
                                $scope.group.singleSource.lists
                                        .singleSourceGet[indice].fileType =
                                        fileExtensions[response.data.fileType].fileType;
                                $scope.group.singleSource.lists
                                        .singleSourceGet[indice].id = data.id;
                                $scope.group.singleSource.lists
                                        .singleSourceGet[indice].tamanho = 0;

                                $scope.group.singleSource.lists
                                        .singleSourceGet[indice].name = response.data.name;


                                for (var path in $scope.group.singleSource.lists.singleSourceGet) {
                                    if ($scope.group.singleSource.lists.singleSourceGet[path].id === $scope.group.singleSource.lists.singleSourceGet[indice].id) {
                                        $scope.group.singleSource.lists.singleSourceGet[indice].tamanho++;
                                        if ($scope.group.singleSource.lists.singleSourceGet[indice].tamanho > 1) {
                                            $scope.group.singleSource.lists.singleSourceGet.splice(indice, 1);
                                        }
                                    }

                                }

                            }
                        }, function (response) {
                            console.log(response);
                        });
            }
        };

        $scope.setEditGroup = function (id) {

            GroupService.getGroupBySingleSourceId(id)
                    .then(function (response) {
                        var singleSourceGroup = response.data.singleSourceGroup;
                        for (var indice in singleSourceGroup) {
                            $scope.group.singleSource
                                    .lists.singleSourceSet[singleSourceGroup[indice].numOrder] = {};
                            $scope.group.singleSource
                                    .lists.singleSourceSet[singleSourceGroup[indice].numOrder]
                                    .binaryFile = GroupService.getFileById(
                                            singleSourceGroup[indice].singleSource.id);

                            $scope.group.singleSource
                                    .lists.singleSourceSet[singleSourceGroup[indice].numOrder]
                                    .name = singleSourceGroup[indice].singleSource.name;

                            $scope.group.singleSource
                                    .lists.singleSourceSet[singleSourceGroup[indice].numOrder]
                                    .fileType = fileExtensions[singleSourceGroup[indice]
                                            .singleSource.fileType].fileType;

                            $scope.group.singleSource
                                    .lists.singleSourceSet[singleSourceGroup[indice].numOrder]
                                    .idSingleSourceGroup = singleSourceGroup[indice].id;

                            $scope.group.singleSource
                                    .lists.singleSourceSet[singleSourceGroup[indice].numOrder]
                                    .id = singleSourceGroup[indice].singleSource.id;
                        }

                    }, function (response) {
                        console.log(response);
                    });

        };

    });
});
