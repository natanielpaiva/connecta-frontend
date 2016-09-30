define([
    'connecta.portal',
    'portal/auth/service/login-service'
], function (portal) {
    portal.service('UserService', function ($http, portalResources, LoginService, $upload, $rootScope) {
        var UserService = this;

        var _sendUpdateUserEvent = function (response) {
            $rootScope.$broadcast('user.update', response.data, UserService.makeBackgroundImage(response.data.id));
        };

        UserService.update = function (user) {
            var url = portalResources.user + '/' + user.id;

            return $http.put(url, user).then(_sendUpdateUserEvent);
        };

        UserService.makeBackgroundImage = function (id) {
            return [
                portalResources.user,
                '/',
                id,
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
        UserService.upload = function (image, user) {
            return $upload.upload({
                url: portalResources.user + '/' + user.id + '/avatar',
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + LoginService.getAuthenticationToken()
                },
                file: image
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).then(_sendUpdateUserEvent);
        };

        UserService.save = function (user) {
            var url = portalResources.user + '/new';

            return $http.post(url, user);
        };
        UserService.saveInvited = function (user) {
            var url = portalResources.user + '/invited' ;

            return $http.post(url, user);
        };

        UserService.getByEmail = function (email) {
            var url = portalResources.user + '/mail' + '?email=' + email;

            return $http.get(url);
        };

        UserService.getByHash = function (hash) {
            var url = portalResources.user + '/hash?hash=' + hash;

            return $http.get(url);
        };

        UserService.getAll = function () {
            var url = portalResources.user;

            return $http.get(url);
        };

        UserService.saveFacebook = function (user) {
            var url = portalResources.user;
            return $http.post(url, user);
        };

        UserService.changePassword = function (credentials) {
            var url = portalResources.user + '/credentials?' +
                      'newPass=' + credentials.password +
                      '&oldPass=' + credentials.authenticatedUserPassword;

            return $http.post(url);
        };

    });
});
