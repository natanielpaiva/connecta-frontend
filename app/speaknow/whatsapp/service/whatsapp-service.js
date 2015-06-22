define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('WhatsappService', function (speaknowResources, $http) {

        this.list = function(params){
            var url = speaknowResources.whatsappAccount + "/list";
            return $http.get(url, {params: params});
        };

        this.listActive = function(){
            var url = speaknowResources.whatsappAccount + "/list-active";
            return $http.get(url);
        };

        this.get = function(accountID){
            var url = speaknowResources.whatsappAccount + "/" + accountID;
            return $http.get(url);
        };

        this.save = function(account){
        	return $http.post(speaknowResources.whatsappAccount, account);
        };

        this.delete = function(accountID){
        	return $http.delete(speaknowResources.whatsappAccount + '/' + accountID);
        };

        this.save = function(account){
            return $http.post(speaknowResources.whatsappAccount, account);
        };

        this.activate = function(accountID, active){
            var url =speaknowResources.whatsappAccount + "/switch";
            var params = {
                accountID: accountID,
                active: active
            };

            return $http({
                url: url,
                method: 'POST',
                params: params
            });
        };
        
    });
});