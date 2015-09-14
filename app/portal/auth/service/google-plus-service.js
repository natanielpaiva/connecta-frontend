define([
    'connecta.portal',
], function (portal) {
    return portal.service('GPlusService', function (UserService, LoginService, $location) {

        var authResult = {};
        var gplusService = this;

        var clientIdRaphael = '10907223025-0qpko1kv6me2afevr4amlnaj6j1hnlk0.apps.googleusercontent.com';
        var clientIdCloud = '341835621722-tl0k8ttfhedql1h9nnlvpifauli7i1gd.apps.googleusercontent.com';

        //Inicia o processo de login
        gapi.signin.render('loginGoogle', {
            'clientid': clientIdCloud,
            'cookiepolicy': 'single_host_origin',
            'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
        });

        this.signinCallback = function (authResult) {
            gplusService.authResult = authResult;
            gapi.client.load('oauth2', 'v2', function () {
                var request = gapi.client.oauth2.userinfo.get();
                request.execute(function (googleUser) {
                    console.log(googleUser, " email callback");
                    gplusService.createGoogleUser(googleUser);
                });
            });
        };

        this.loginWithGoogle = function () {
            gapi.signin.render('loginGoogle', {
                'callback': this.signinCallback,
                'clientid': clientIdCloud,
                'cookiepolicy': 'single_host_origin',
                'requestvisibleactions': 'http://schemas.google.com/AddActivity',
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
            });
        };

        this.createGoogleUser = function (userGoogle) {
            if (userGoogle.email) {
                var user = {
                    profile: {
                        "firstName": userGoogle.given_name,
                        "lastName": userGoogle.family_name,
                        "email": userGoogle.email,
                        "avatarUrl": userGoogle.picture
                    },
                    credentials: {
                        "token": gplusService.authResult.access_token,
                        "tokenType": "GOOGLE"
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
