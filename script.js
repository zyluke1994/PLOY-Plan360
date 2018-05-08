allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
};

// var underscore = angular.module('underscore', []);
// underscore.factory('_', ['$window', function($window) {
// return $window._;
// }]);

var app = angular.module("plan360", ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'datetime', 'ui.grid', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.calendar', 'pageslide-directive', 'gm', 'ngFileUpload','xeditable','ngQuill','textAngular','cp.ngConfirm','hl.sticky','ngTable','angular.filter']).
  config(['$routeProvider', '$locationProvider', '$httpProvider' , function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.when('/inputPlan',
      {
        templateUrl: 'view/inputPlan.html',
        controller: 'inputPlanCtrl'
      });
    $routeProvider.when('/inputAttraction',
      {
        templateUrl: 'view/inputAttraction.html',
        controller: 'inputAttractionCtrl'
      });
    $routeProvider.when('/viewAttraction',
      {
        templateUrl: 'view/viewAttraction.html',
        controller: 'viewAttractionCtrl'
      });
    $routeProvider.when('/viewPlan',
      {
        templateUrl: 'view/viewPlan.html',
        controller: 'viewPlanCtrl'
      });
      $routeProvider.when('/viewPlan/:tripid',
      {
        templateUrl: 'view/viewPlan.html',
        controller: 'viewPlanCtrl'
      });
      $routeProvider.when('/destinationInfoTemplate',
      {
        templateUrl: 'view/destinationInfoTemplate.html',
        controller: 'destinationInfoTemplateCtrl'
      });
    $routeProvider.when('/clientOnboard',
      {
        templateUrl: 'view/clientOnboard.html',
        controller: 'clientOnboardCtrl'
      });
    $routeProvider.when('/login', {
      controller: 'loginCtrl',
      templateUrl: 'view/login.html',
      hideNavbar: true
    });

    $routeProvider.when('/', {
      controller: 'homeCtrl',
      templateUrl: 'view/home.html'
    });
    $routeProvider.when('/home', {
      controller: 'homeCtrl',
      templateUrl: 'view/home.html'
    });
    $routeProvider.otherwise(
      {
        redirectTo: '/',
      }
    );
  }])
  .run(['$rootScope', '$location', '$cookieStore', '$http','editableOptions',
    function ($rootScope, $location, $cookieStore, $http,editableOptions) {
      $rootScope.location = $location;
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
      // keep user logged in after page refresh
      $rootScope.globals = $cookieStore.get('globals') || {};
      if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
          $location.path('/login');
        }
      });
    }]);


app.controller('NavCtrl',
  ['$scope', '$location', 'AuthenticationService', '$rootScope', '$http','$timeout', function ($scope, $location, AuthenticationService, $rootScope, $http, $timeout) {
    $scope.userLogin = $rootScope.globals.currentUser.username;
    $scope.userRole = $rootScope.globals.currentUser.role;
    $scope.isAdmin = false;

    if ($rootScope.globals.currentUser.role === "admin") {
      $scope.isAdmin = true;
  }
    $scope.userFullname = $rootScope.userFullname;

    $scope.userEmail = $rootScope.userEmail;

    console.log($scope.userLogin);
    if (typeof $scope.userLogin !== null) {
      $http.post('/api/authenticate.php',
        { 'username': $scope.userLogin, 'updateType': 'getname' })
        .then(function (response) {
          console.log(response);
          $rootScope.userFullname = response.data[0].name;
          $rootScope.userEmail = response.data[0].email;
          $scope.userFullname = response.data[0].name;
          $scope.userEmail = response.data[0].email;

        });


    }

    // Function to replicate setInterval using $timeout service.
  $scope.intervalFunction = function(){
    $timeout(function() {
      getPendingReviewList();
      $scope.intervalFunction();
    }, 5000)
  };

  // Kick off the interval
  getPendingReviewList();
  
  $scope.intervalFunction();

    function getPendingReviewList(){
      $http.get("/api/planReview/getPlanReview.php", {
        params: { status: 'REQUESTED' }
      })
        .then(function (response) {
          // console.log("from script.js: response fore plan review:" + response);
  
          // console.log(response);
          $scope.pendingReviewList = response.data;
        });
    }
    
      
    console.log("from script.js: username: " + $scope.userLogin);
    console.log("from script.js: role:" + $scope.userRole);
    $scope.generateKey = function (roleGroup) {

      console.log("from script.js: generate key for:" + roleGroup);
      if (roleGroup == "admin") {
        $scope.randomActivationKey = "ad" + Math.random().toString(36).substr(2, 6);

      } else if (roleGroup == "basic") {
        $scope.randomActivationKey = "ba" + Math.random().toString(36).substr(2, 6);

      }
      console.log("from script.js: key is" + $scope.randomActivationKey);

      $http.get(
        "/api/authenticate.php", {
          params: {
            'activationKey': $scope.randomActivationKey,
            'keyGivenBy': $scope.userLogin,
            'role': roleGroup,
          }



        }
      ).then(function (response) {
        console.log("Key Inserted");
      })


    }


    $scope.navClass = function (page) {
      var currentRoute = $location.path().substring(1) || 'home';
      return page === currentRoute ? 'active' : '';
    };

    $scope.loadHome = function () {
      $location.url('/home');
    };
    $scope.loadInputPlan = function () {
      $location.url('/inputPlan');
    };

    $scope.loadInputAttraction = function () {
      $location.url('/inputAttraction');
    };

    $scope.loadClientOnboard = function () {
      $location.url('/clientOnboard');
    };
    $scope.loadViewAttraction = function () {
      $location.url('/viewAttraction');
    };
    $scope.loadViewPlan = function () {
      $location.url('/viewPlan');
    };
    $scope.loadViewPlanID = function (id) {
      $location.url('/viewPlan:'+id);
    };
    $scope.loadDestinationInfoTemplate = function () {
      $location.url('/destinationInfoTemplate');
    };
    $scope.logout = function () {
      $location.url('/login');


    };


  }]);
app.use(allowCrossDomain);



