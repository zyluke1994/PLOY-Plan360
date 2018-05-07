app.controller('inputPlanCtrl', function ($scope, $http, $compile, $rootScope, $location) {
  console.log('inside inputPlanCtrl');
  $scope.planStatusHide = true;
  $http.get("../api/customers/getCustomer.php")
    .then(function (response) {
      $scope.customerList = response.data;
      $scope.userLogin = $rootScope.globals.currentUser.username;
    })


var dateNow = new Date();
  var userLogin = $rootScope.globals.currentUser.username;
  $scope.insertPlanToCustomer = function () {
    $http.post(
      "../api/plans/insertPlan.php", {
        'customerID': $scope.customerSelected.customerID,
        'customerName': $scope.customerSelected.fullName,
        'tripName': $scope.tripName,
        'tripStart': $scope.tripStart,
        'tripEnd': $scope.tripEnd,
        'tripOrigin': $scope.tripOrigin,
        'tripStops': $scope.tripStops,
        'tripFinalDestination': $scope.tripFinalDestination,
        'planStart': $scope.planStart,
        'planDeadline': $scope.planDeadline,
        'notes': $scope.notes,
        'inputBy': userLogin,
        'plannerName':$rootScope.userFullname,
        'plannerEmail':$rootScope.userEmail,
        'plannerPhone':"000000000",
        'plannerUsername':userLogin,
        'plannerNotes':"Inputed by Planner"
        
        
      }
    ).then(function (response) {
      $scope.insertPlanResponse=response.data;
      console.log("Data Inserted");
      $scope.planStatusHide = false;
      $scope.planStatusText = "Plan "+$scope.tripName+" Inserted Successfully";
      clearTable();
    })
  };

  function clearTable() {
    $scope.customerSelected = "";
    $scope.tripName = "";
    $scope.tripStart = "";
    $scope.tripEnd = "";
    $scope.tripOrigin = "";
    $scope.tripStops = "";
    $scope.tripFinalDestination = "";
    $scope.planStart = "";
    $scope.planDeadline = "";
    $scope.notes = "";

  }
   $scope.loadClientOnboard = function () {
      $location.url('/clientOnboard');
    };

  /* Bindable functions
   -----------------------------------------------*/
  $scope.trip_endDateBeforeRender = trip_endDateBeforeRender
  $scope.trip_endDateOnSetTime = trip_endDateOnSetTime
  $scope.trip_startDateBeforeRender = trip_startDateBeforeRender
  $scope.trip_startDateOnSetTime = trip_startDateOnSetTime

  $scope.plan_endDateBeforeRender = plan_endDateBeforeRender
  $scope.plan_endDateOnSetTime = plan_endDateOnSetTime
  $scope.plan_startDateBeforeRender = plan_startDateBeforeRender
  $scope.plan_startDateOnSetTime = plan_startDateOnSetTime

  function trip_startDateOnSetTime() {
    $scope.$broadcast('trip_start-date-changed');
  }

  function trip_endDateOnSetTime() {
    $scope.$broadcast('trip_end-date-changed');
  }
  function plan_startDateOnSetTime() {
    $scope.$broadcast('plan_start-date-changed');
  }

  function plan_endDateOnSetTime() {
    $scope.$broadcast('plan_end-date-changed');
  }

  function trip_startDateBeforeRender($dates) {
    if ($scope.tripEnd) {
      var activeDate = moment($scope.tripEnd);

      $dates.filter(function (date) {
        return date.localDateValue() >= activeDate.valueOf()
      }).forEach(function (date) {
        date.selectable = false;
      })
    }
  }

  function trip_endDateBeforeRender($view, $dates) {
    if ($scope.tripStart) {
      var activeDate = moment($scope.tripStart).subtract(1, $view).add(1, 'minute');

      $dates.filter(function (date) {
        return date.localDateValue() <= activeDate.valueOf()
      }).forEach(function (date) {
        date.selectable = false;
      })
    }
  }
  function plan_startDateBeforeRender($dates) {
    if ($scope.planDeadline) {
      var activeDate = moment($scope.planDeadline);

      $dates.filter(function (date) {
        return date.localDateValue() >= activeDate.valueOf()
      }).forEach(function (date) {
        date.selectable = false;
      })
    }
  }

  function plan_endDateBeforeRender($view, $dates) {
    if ($scope.planStart) {
      var activeDate = moment($scope.planStart).subtract(1, $view).add(1, 'minute');

      $dates.filter(function (date) {
        return date.localDateValue() <= activeDate.valueOf()
      }).forEach(function (date) {
        date.selectable = false;
      })
    }
  }
});