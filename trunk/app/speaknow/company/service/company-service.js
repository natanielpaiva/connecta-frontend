define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.service('CompanyService', function (speaknowResources, $http, $upload, $q, $heading) {

        this.list = function (params) {
            var url = speaknowResources.company + "/list";
            return $http.get(url, {params: params});
        };

        this.get = function (id) {
            var url = speaknowResources.company + "/" + id;
            return $http.get(url);
        };

        this.getUserCompany = function () {
            var url = speaknowResources.company + "/userCompany";
            return $http.get(url);
        };

        this.getUserCompanyLogo = function(){
          var deferred = $q.defer();
          var url = speaknowResources.company + "/userCompany";
          $http.get(url).then(function(response){
            var logoSrc = speaknowResources.base + response.data.imageRect;
            deferred.resolve(logoSrc);
          });

          return deferred.promise;
        };

        this.save = function (fileQuad, fileRect, company) {
            var url = speaknowResources.company + "/save";
            var fd = new FormData();
            fd.append('fileQuad', fileQuad);
            fd.append('fileRect', fileRect);
            fd.append('company', JSON.stringify(company));

            var promise = $http.post(url, fd, {
                headers: {'Content-Type': undefined}
            }).then(function(response){
              var logoSrc = speaknowResources.base + response.data.imageRect;
              $heading.setLogo(logoSrc);
            });

            return promise;
        };

        this.delete = function (id){
            var url = speaknowResources.company + "/" + id;
            return $http.delete(url);
        };

        this.getQuestionTypes = function () {
            var url = speaknowResources.interaction + "/poll/question/types";
            return $http.get(url);
        };

        this.getLatLong = function(address){
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address;
            return $http.get(url,
            {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                },
                'withCredentials': false
            });
        };
    });
});