define([
    'connecta.portal',
], function (portal) {
    return portal.service('FacebookService', function (Facebook, UserService, LoginService, $rootScope) {

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
            Facebook.api('/me?fields=email,name,first_name,last_name,picture', function (user) {
                console.log(user);
                if(user.email){
                    facebookService.createFacebookUser(user);
                } else {
                    $rootScope.$broadcast('facebook-without-email', user);
                }

            });
        };

        this.createFacebookUser = function (userFacebook) {
            if (userFacebook.email) {
                var user = {
                    profile: {
                        "firstName": userFacebook.first_name,
                        "lastName": userFacebook.last_name,
                        "email": userFacebook.email,
                        "avatarUrl": userFacebook.picture.data.url
                    },
                    credentials: {
                        "token": this.authResponse.accessToken,
                        "tokenType": "FACEBOOK"
                    }
                };
                UserService.saveFacebook(user).then(function (response) {
                    LoginService.setAuthenticatedUser(response);
                    console.log(response);
                });
            } else {

            }
        };

    });
});
