'use strict';

app
    .factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
        function (Base64, $http, $cookieStore, $rootScope, $timeout) {
            var service = {};

            service.Login = function (username, password, callback) {

                /* Dummy authentication for testing, uses $timeout to simulate api call
                 ----------------------------------------------*/
                // $timeout(function(){
                //     var response = { success: username === 'test' && password === 'test' };
                //     if(!response.success) {
                //         response.message = 'Username or password is incorrect';
                //     }
                //     callback(response);
                // }, 1000);


                //Use this for real authentication
                /*----------------------------------------------*/
                $http.post('../api/authenticate.php', { 'username': username, 'password': password })
                    .then(function (response) {
                        console.log(response.data);
                        $rootScope.userFullname = response.data[0].name;
                        $rootScope.userEmail = response.data[0].email;
                        console.log($rootScope);
                        console.log($rootScope.userFullname);
                        console.log($rootScope.userEmail);
                        
                        
                        
                        if (response.data === "Username or Password Incorrect") {
                            console.log("in if");
                        }
                        callback(response);
                    });

            };
            service.SignUp = function (signupUsername, signupPassword, signupFullName, signupActivationKey,signupEmail, callback) {

                //Use this for real authentication
                /*----------------------------------------------*/
                $http.post('../api/authenticate.php', {
                    'updateType': "signup",
                    'signupUsername': signupUsername,
                    'signupPassword': signupPassword,
                    'signupFullName': signupFullName,
                    'signupActivationKey': signupActivationKey,
                    'signupEmail': signupEmail
                    
                })
                    .then(function (response) {
                        console.log(response);

                        if (response.data === "Inserted") {
                            console.log("in if");
                        } else if (response.data === "Invalid Activation Key") {
                            console.log("in if invalid");

                        }
                        callback(response);
                    });

            };

            service.SetCredentials = function (username, password, role) {
                var authdata = Base64.encode(username + ':' + password);
                console.log("from loginCtrl: role= " + role);

                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        role: role,
                        authdata: authdata
                    }
                };

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                $cookieStore.put('globals', $rootScope.globals);
            };

            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                $http.defaults.headers.common.Authorization = 'Basic ';
            };

            return service;
        }])

    .factory('Base64', function () {
        /* jshint ignore:start */

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };

        /* jshint ignore:end */
    })
    .controller('loginCtrl',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
        function ($scope, $rootScope, $location, AuthenticationService) {
            // reset login status
            AuthenticationService.ClearCredentials();

            $scope.login = function () {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    console.log(response.data[0].username);
                    if (response.data[0].username == $scope.username) {
                        AuthenticationService.SetCredentials($scope.username, $scope.password, response.data[0].role);
                        $location.path('/');
                    } else {
                        console.log(response.data);

                        $scope.error = response.data;
                        $scope.dataLoading = false;
                    }
                });
            };

            $scope.signup = function () {
                console.log($scope.signupUsername);
                if ($scope.signupPassword === $scope.signupPassword2) {
                    AuthenticationService.SignUp($scope.signupUsername, $scope.signupPassword, $scope.signupFullName, $scope.signupActivationKey, $scope.signupEmail, function (response) {
                        console.log(response);
                        $scope.statusMessage = response.data;
                    });
                }else{
                     $scope.statusMessage = "Passwords don't match.";
                     $scope.signupPassword2 = "";
                     $scope.signupPassword = "";
                }



            }
        }]);