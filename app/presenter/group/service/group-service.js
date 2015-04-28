define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {

    return presenter.lazy.service('GroupService', function (presenterResources, $http, $autocomplete) {
        var types = [
            {
                id: 'FOLDER',
                name: 'FOLDER',
            },
            {
                id: 'GALLERY',
                name: 'GALLERY',
            }
        ];

        var typeFilter = [
            {
                id: 'GROUP.SELECT_FILE',
                name: 'GROUP.SELECT_FILE',
                template: '_group-select-file.html'
            },
            {
                id: 'GROUP.FILTER',
                name: 'GROUP.FILTER',
                template: '_group-filter.html'
            }
        ];


        var _fixGroup = function (group) {
            group.singleSourceGroup = [];
            group.type = group.type.id;
            for (var numOrder in group.singleSource.lists.singleSourceSet) {
                if (group.singleSource.lists.singleSourceSet[numOrder]
                        .idSingleSourceGroup !== undefined) {
                    group.singleSourceGroup.push({"numOrder": numOrder,
                        "id": group.singleSource.lists.singleSourceSet[numOrder].idSingleSourceGroup,
                        "singleSource": {
                            "id": group.singleSource.lists.singleSourceSet[numOrder].id
                        }});

                } else {
                    group.singleSourceGroup.push({"numOrder": numOrder,
                        "singleSource": {
                            "id": group.singleSource.lists.singleSourceSet[numOrder].id
                        }});
                }
            }
            delete group.singleSource;
            delete group.typeFilter;
            delete group.path;
        };

        this.getSingleSource = function (value) {
            return $autocomplete(presenterResources.singlesource + "/auto-complete", {
                name: value
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        };


        this.getTypes = function () {
            return types;
        };

        this.getTypeFilter = function () {
            return typeFilter;
        };


        this.list = function () {
            var url = presenterResources.group;
            return $http.get(url);
        };

        this.delete = function (id) {
            var url = presenterResources.group + '/' + id;
            return $http.delete(url);
        };

        this.getById = function (id) {
            var url = presenterResources.group + '/' + id;
            return $http.get(url);
        };

        this.getFileById = function (id) {
            return presenterResources.singlesource + '/' + id + '/binary';
        };

        this.getSingleSourceById = function (id) {
            var url = presenterResources.singlesource + "/" + id;
            return $http.get(url);
        };

        this.getGroupBySingleSourceId = function (id) {
            var url = presenterResources.group + "/single-source/" + id;
            return $http.get(url);
        };

        this.save = function (group) {
            _fixGroup(group);
            var url = presenterResources.group;
            var groupCopy = angular.copy(group);

            if (group.id === undefined) {
                return $http.post(url, groupCopy);
            } else {
                return $http.put(url + "/" + group.id, groupCopy);
            }

        };

    });



});