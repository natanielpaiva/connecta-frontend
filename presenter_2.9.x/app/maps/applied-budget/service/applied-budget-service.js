define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('AppliedBudgetService', function (mapsResources, $http) {
        this.get = function (id) {
            var url = mapsResources.appliedBudget + "/" + id;
            return $http.get(url);
        };

        this.list = function () {
            var url = mapsResources.appliedBudget;
            return $http.get(url);
        };

        this.save = function (appliedBudget) {
            return $http.post(mapsResources.appliedBudget, appliedBudget);
        };

        this.delete = function (id) {
            var url = mapsResources.appliedBudget + '/' + id;
            return $http.delete(url);
        };



        this.geocode = function (address,scope) {
             scope.geocodedObject=undefined;

            $.ajax({
                url: "http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=true",
                type: 'get',
                dataType: 'json',                
                success: function (data) {
                    if (data) {                   
                        scope.geocodedObject=data;
                    } else {
                    }
                },
                error: function () {
                    console.info("ERROR");
                }
            });




        };






        this.retirarAcentos = function (string) {

            string = string.replace(new RegExp('[ÁÀÂÃáàãâ]', 'gi'), 'a');
            string = string.replace(new RegExp('[ÉÈÊéèê]', 'gi'), 'e');
            string = string.replace(new RegExp('[ÍÌÎíìî]', 'gi'), 'i');
            string = string.replace(new RegExp('[ÓÒÔÕóòôõ]', 'gi'), 'o');
            string = string.replace(new RegExp('[ÚÙÛúùû]', 'gi'), 'u');
            string = string.replace(new RegExp('[Çç]', 'gi'), 'c');

            return string;
        };

    });
});
