define([
    'connecta.presenter',
    'presenter/datasource/service/datasource-service',
    'presenter/datasource/controller/modal-rest-response',
], function (presenter) {
    return presenter.lazy.controller('DatasourceFormController', function ($scope, $window, DatasourceService, $location, $routeParams, util, notify, $uibModal) {
        $scope.mapToArray = util.mapToArray;
        $scope.stringFinal = "";
        $scope.form = {
            types: DatasourceService.getTypes(),
            drivers: DatasourceService.getDatabaseDrivers(),
            rest: {
                addNewHeader: function (request) {
                    request.headers.push({});
                },
                addNewRequest: function () {

                    if ($scope.datasource.user || $scope.datasource.password) {
                        $scope.datasource.requests.push({
                            headers: [{
                                    key: 'Authorization',
                                    value: makeBasicHash(),
                                }],
                            parametersBody: [{}],
                            variables: [{}]
                        });
                    } else {
                        $scope.datasource.requests.push({
                            headers: [{}],
                            parametersBody: [{}],
                            variables: [{}]
                        });
                    }
                },
                deleteRequest: function (index, $event) {
                    $scope.datasource.requests.splice(index, 1);
                    $event.preventDefault();
                },
                sendRequest: function (request) {
                    DatasourceService.sendRequest(request).then(function (response) {
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'app/presenter/datasource/template/_modal-rest-response.html',
                            controller: 'ModalResponse',
                            size: 'lg',
                            resolve: {
                                response: function () {
                                    return response.data;
                                }
                            }
                        });
                    });
                },
                createBody: function (request) {
                    var stringBody = "";
                    var qt = request.parametersBody.length - 1;
                    request.parametersBody.forEach(function (b, i) {
                        stringBody += b.key + "=" + b.value;
                        if (qt !== i) {
                            stringBody += "&";
                        }
                    });
                    request.body = stringBody;
                },
                addNewParameterBody: function (request) {
                    request.parametersBody.push({});
                },
                addNewVariable: function (request) {
                    request.variables.push({
                        name: null,
                        value: null
                    });
                },
                basicAuthorization: function () {
                    var requests = $scope.datasource.requests;
                    for (var i = 0; i < requests.length; i++) {
                        var headers = requests[i].headers;
                        for (var j = 0; j < headers.length; j++) {
                            console.log("headers ", headers[j]);
                            if (headers[j].key === 'Authorization') {
                                headers[j].value = makeBasicHash();
                                break;
                            }
                            if ((headers.length - 1) === j) {
                                headers.push({
                                    key: 'Authorization',
                                    value: makeBasicHash()
                                });
                            }
                        }
                    }
                },

                status: {
                    isCustomHeaderOpen: false,
                    isFirstOpen: true,
                    isFirstDisabled: false
                },
                verbs: ['POST', 'GET'],
                mediaType: [
                    'application/x-www-form-urlencoded',
                    'application/json',
                    'application/xml',
                    'multipart/form-data'
                ],
                possibleHeaders: ['Accept', 'Accept-Charset', 'Accept-Encoding', 'Authorization', 'Content-Type']
            }
        };
        if ($routeParams.id) {

            DatasourceService.getById($routeParams.id).then(function (response) {

                if (response.data.type === "REST") {
                    DatasourceService.getRestRequestById($routeParams.id).then(function (response) {
                        $scope.datasource = response.data;
                        $scope.datasource.requests.forEach(function (request) {
                            if (request.typeBody === "FORM_DATA") {
                                var body = request.body;
                                var parameteres = body.split("&");
                                request.parametersBody = [];
                                parameteres.forEach(function (kv) {
                                    var keyValue = kv.split("=");
                                    request.parametersBody.push({
                                        key: keyValue[0],
                                        value: keyValue[1]
                                    });
                                });
                            }
                        });
                    });
                } else {
                    $scope.datasource = response.data;
                }
            });
        } else {
            $scope.datasource = {
                type: 'DATABASE',
                driver: 'ORACLE_SID',
                hdfsPort: 50070
            };
            $scope.$watch('datasource.driver', function (selected) {
                if (selected) {
                    $scope.datasource.port = $scope.form.drivers[selected].defaultPort;
                }
            });
            $scope.datasource.requests = [{
                    headers: [{}, {}],
                    parametersBody: [{}],
                    variables: [{}]
                }];
        }

        $scope.testConnection = function () {
            DatasourceService.testConnection($scope.datasource).then(function () {
                notify.success('Conexão feita com sucesso!');
            });
        };
        $scope.submit = function () {
            DatasourceService.save($scope.datasource).then(function (response) {
                $location.path('presenter/datasource/' + response.data.id);
            });
        };
        $scope.sendRequest = function (request) {

            DatasourceService.sendRequest(request).then(function (response) {
                console.log(response.data);
                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/presenter/datasource/template/_modal-rest-response.html',
                    controller: 'ModalResponse',
                    size: 'lg',
                    resolve: {
                        response: function () {
                            return response.data;
                        }
                    }
                });
            });
        };
        function makeBasicHash() {
            var tok = $scope.datasource.user + ':' + $scope.datasource.password;
            var hash = window.btoa(tok);
            return "Basic " + hash;
        }
        $scope.onTextClick = function () {
            //$event.target.select();

            console.log($window.getSelection().toString());
            console.log($window.getSelection());
            console.log($window);
        };
    });
});