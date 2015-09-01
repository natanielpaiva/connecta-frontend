define([
    'connecta.portal',
], function (portal) {
    return portal.service('FacebookService', function (Facebook, UserService, LoginService) {

        var authResponse = {};
        var facebookService = this;

        this.login = function () {
            Facebook.login(function (response) {
                if (response.status === 'connected') {
                    facebookService.authResponse = response.authResponse;
                    facebookService.me();
                }

            }, {
                scope: 'email',
                return_scopes: true
            });
        };

        this.me = function () {
            Facebook.api('/me', function (user) {
                console.log(user);
//                user.email = "raphael.vtr@gmail.com";
                facebookService.createFacebookUser(user);

            });
        };

        this.createFacebookUser = function (userFacebook) {
            if (userFacebook.email) {
                var user = {
                    profile: {
                        "firstName": userFacebook.first_name,
                        "lastName": userFacebook.last_name,
                        "email": userFacebook.email,
                        "avatarUrl": "http://graph.facebook.com/" + userFacebook.id + "/picture?type=large"
                    },
                    credentials: {
                        "token": this.authResponse.accessToken,
                        "tokenType": "FACEBOOK"
                    }
                };
                UserService.saveFacebook(user).then(function (response) {
                    LoginService.setAuthenticatedUser(response);
                    $location.path('/');
                    console.log(response);
                });
            } else {

            }
        };

    });
});
