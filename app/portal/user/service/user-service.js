define([
    'connecta.portal'
], function (portal) {
    portal.service('UserService', function ($http, portalResources) {

        this.updateUser = function (user, userImg) {
            var url = portalResources.user + '/profile';

            var fd = new FormData();
            fd.append('image', userImg);
            fd.append('user', JSON.stringify(user));

            return $http.post(url, fd, {
                headers: {'Content-Type': undefined}
            });
        };

        this.save = function (user, image) {
            var url = portalResources.user + '/create';

            var fd = new FormData();
            fd.append('image', image);
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
