define([
    'connecta.portal',
    'portal/auth/service/login-service'
], function (portal) {
    portal.service('UserService', function ($http, portalResources, LoginService, $upload) {
        
        this.update = function (user) {
            var url = portalResources.user + '/' + user.id;

            return $http.put(url, user);
        };
        
        this.makeBackgroundImage = function(user){
            return [
                portalResources.user,
                '/',
                user.id,
                '/profile.png?access_token=',
                LoginService.getAuthenticationToken(),
                '&_=',
                new Date().getTime()
            ].join('');
        };

        /**
         * 
         * @param {type} image
         * @param {type} user
         * @returns {unresolved}
         */
        this.upload = function (image, user) {
            return $upload.upload({
                url: portalResources.user+'/'+user.id+'/avatar',
                method: 'POST',
                headers: {
                    Authorization:"Bearer " + LoginService.getAuthenticationToken()
                },
                file: image
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            });
        };
        
//        this.deletePhoto = function (id) {
//            var url = portalResources.user + '/delete';
//
//            var fd = new FormData();
//            fd.append('id', JSON.stringify(id));
//
//            return $http.delete(url, fd, {
//                headers: {'Content-Type': undefined}
//            });
//        };

        this.save = function (user) {
            var url = portalResources.user + '/create';

            var fd = new FormData();
            fd.append('user', JSON.stringify(user));

            return $http.post(url, fd, {
                headers: {'Content-Type': undefined}
            });
        };

        this.saveFacebook = function (user) {
            var url = portalResources.user;
            return $http.post(url, user);
        };

        this.changePassword = function (credentials) {
            var url = portalResources.user + '/credentials';
            return $http.put(url, credentials);
        };

    });
});
