define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('PresenterSourceService', function (mapsResources, $http) {

        this.get = function (id) {
            var url = mapsResources.presenterSource + "/" + id;
            return $http.get(url);
        };
        this.list = function () {
            var url = mapsResources.presenterSource;
            return $http.get(url);
        };
        this.save = function (presenterSource) {
            return $http.post(mapsResources.presenterSource, presenterSource);
        };
        this.delete = function (id) {
            var url = mapsResources.presenterSource + '/' + id;
            return $http.delete(url);
        };

        this.getUserDomain = function (presenterSource, scope) {
            this.scope = scope;
            var url = presenterSource.url + '/controller/auth/' + presenterSource.username;
            var that = this;
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                contentType: "application/json",
                dataType: 'json',
                success: function (data) {
                    console.info("JQUERY", data);
                    that.getAnalysisList(presenterSource, data.Domain[0].name);
                },
                error: function (response) {
                    console.info("ERROR");
                }
            });
        };
        this.getAnalysisList = function (presenterSource, domain) {
            var that = this;
            var base64Data = window.btoa(presenterSource.username + "@" + domain + ":" + presenterSource.password);
            $.ajax({
                url: presenterSource.url + "/controller/mapsController/getAnalysis",
                type: 'post',
                async:false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + base64Data);
                },
                data: {data: JSON.stringify({"Analysis": {"_action": "list", "title": null, "analysisSource.protocol": null, "id": null}})},
                success: function (data) {
                    console.info("Analysis List", data);
                    that.scope.presenterAnalysis = data.retorno.Analysis;
                },
                error: function () {
                    console.info("ERROR");
                }
            });
        };
        
        
        this.getAnalysisData = function (scope,idAnalysis) {
            $.ajax({
                url: scope.presenterSource.url+"/controller/analysis/get",
                type: 'post',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                },
                dataType: 'json',
                async:false,
                data: {data: JSON.stringify({"id": idAnalysis})},
                success: function (data) {
                    if (data) {
                        console.info("ANALYSIS DATA", data);
                        scope.analysisColumns = data.columnHeading;
                        scope.analysisData = data.data;
                        scope.analysisColumnsMetric=data.columnHeading;
                        console.info("scope.analysisData",scope.analysisColumns,scope.analysisData,scope.analysisColumnsMetric);
                    } 
                },
                error: function () {
                    console.info("ERROR");
                }
            });


        }
        ;
    });
});