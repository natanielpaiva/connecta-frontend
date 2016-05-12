define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {

    return presenter.lazy.service('SingleSourceService', function ($autocomplete, presenterResources,
              $http, $upload, DomainService, LoginService) {

        var types = {
            FILE: {
                name: 'FILE',
                icon:'icon-insert-drive-file',
                template: '_single-source-file.html'
            },
            URL: {
                name: 'URL',
                icon:'icon-link',
                template: '_single-source-url.html'
            }
        };

        var typesArray = [
            {
                id: 'FILE',
                name: 'FILE',
                icon:'icon-insert-drive-file',
                template: '_single-source-file.html'
            },
            {
                id: 'URL',
                name: 'URL',
                icon:'icon-link',
                template: '_single-source-url.html'
            }
        ];

        var attributeTypes = [
            {
                value: 'TEXT',
                label: 'TEXT'
            },
            {
                value: 'MAP',
                label: 'MAP'
            },
            {
                value: 'DATE',
                label: 'DATE'
            }

        ];

        var _fixAttributes = function (singlesource) {
            angular.forEach(singlesource.singleSourceAttributes, function (attribute) {
                if (angular.isString(attribute.attribute)) {
                    attribute.attribute = {name: attribute.attribute, description:"", type:attribute.attributeType.label};
                    delete attribute.attributeType;
                }else{
                    if(attribute.attributeType !== undefined){
                        attribute.attribute.type = attribute.attributeType.label;
                        delete attribute.attributeType;
                    }
                }
            });
        };

        this.getAttribute = function (value) {
            return $autocomplete(presenterResources.attribute, {
                name: value
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        };

        this.save = function (file, singlesource) {
            _fixAttributes(singlesource);
            singlesource.domain = DomainService.getDomainName();

            return $upload.upload({
                url: presenterResources.singlesource + "/file",
                method: 'POST',
                headers: { "Authorization" : "Bearer " + LoginService.getAuthenticationToken()},
                fields: {
                    singlesource: singlesource
                },
                file: file
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
                console.log(data);
            });
        };

        this.updateUrl = function (singlesource) {
            _fixAttributes(singlesource);
            var url = getTypeUrl(singlesource);

            var singlesourceCopy = angular.copy(singlesource);
            singlesourceCopy.type = singlesourceCopy.type.id;

            return $http.put(url, singlesourceCopy);
        };

        this.saveUrl = function (singlesource) {
            _fixAttributes(singlesource);
            var url = getTypeUrl(singlesource);

            var singlesourceCopy = angular.copy(singlesource);
            singlesourceCopy.type = singlesourceCopy.type.id;
            singlesourceCopy.domain = DomainService.getDomainName();

            return $http.post(url, singlesourceCopy);
        };

        var getTypeUrl = function (singlesource) {
            var nameType = "";
            if( singlesource.type.id === undefined ){
                nameType = singlesource.type.toLowerCase();
            }else{
                nameType = singlesource.type.id.toLowerCase();
            }
            return presenterResources.singlesource + '/' + nameType;
        };

        this.getTypes = function () {
            return types;
        };

        // FIXME Remover, utilizar apenas o mapa
        this.getTypesArray = function () {
            return typesArray;
        };

        this.getAttributeTypes = function(){
            return attributeTypes;
        };

        this.list = function () {
            var url = presenterResources.singlesource;
            return $http.get(url);
        };

        this.delete = function (id) {
            var url = presenterResources.singlesource + '/' + id;
            return $http.delete(url);
        };

        this.getById = function (id) {
            var url = presenterResources.singlesource + '/' + id;
            return $http.get(url);
        };

        this.getFileById = function (id) {
            return presenterResources.singlesource + '/' + id + '/binary';
        };

        this.bulkRemove = function (singlesources) {
            return $http.delete(presenterResources.singlesource, {
                data: singlesources.map(function(e){
                    return e.id;
                }),
                headers: {
                    // WTF, saporra ta mandando text/plain
                    'Content-Type': 'application/json'
                }
            });
        };

    });

});
