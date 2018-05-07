app.controller('homeCtrl', function ($scope, $http, $compile, $rootScope, $location, $timeout,NgTableParams) {
    if ($rootScope.globals.currentUser.role === "admin") {
        $scope.isAdmin = true;
    };
    $http.get("../api/attractions/getAttraction.php")
        .then(function (response) {
            $scope.attractionLength = response.data.length;
            $scope.userLogin = $rootScope.globals.currentUser.username;
        });
    $http.get("../api/customers/getCustomer.php")
        .then(function (response) {
            $scope.customerLength = response.data.length;
            $scope.userLogin = $rootScope.globals.currentUser.username;
        });
    $http.get("../api/plans/getPlans.php")
        .then(function (response) {
            console.log(response);

            $scope.planLength = response.data.length;
            $scope.myPlanListAll = response.data;

            $scope.userLogin = $rootScope.globals.currentUser.username;
            $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });

        });
    console.log($rootScope.globals.currentUser.username);
    $http.get("../api/plans/getPlans.php", {
        params: { inputBy: $rootScope.globals.currentUser.username }
    })
        .then(function (response) {
            console.log(response);
            if(response.data ==="NO DATA"){
                console.log("no plan");
                $scope.myPlanList={};
                
                
            }else{
                console.log("yes plan");
                $scope.myPlanList = response.data;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList});
            
                
            }
            
        });

    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms

    var tick = function () {
        $scope.clockEST = moment().utcOffset(-4).format("ddd, L, h:mm:ss a");
        $scope.clockUTC8 = moment().utcOffset(8).format("ddd, L, h:mm:ss a");

        ; // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }

    // Start the timer
    $timeout(tick, $scope.tickInterval);

   
    $scope.loadClientOnboard = function () {
        $location.url('/clientOnboard');
    };
    $scope.loadViewAttraction = function () {
        $location.url('/viewAttraction');
    };
    $scope.loadViewPlan = function () {
        $location.url('/viewPlan');
    };
    $scope.loadInputPlan = function () {
        $location.url('/inputPlan');
      };

    // $scope.loadPlanFromHome = function (planID) {
    //     $location.url('/viewPlan');
    //     loadPlanToPlanCtrl($scope,planID);
    // };
    $scope.loadViewPlanID = function (id) {
        console.log("load");
        $location.url('/viewPlan/'+id);
      };
     
   
    // function loadPlanToPlanCtrl($scope,planID) {
    //     console.log("loadPlanToPlanCtrl");
    //     $rootScope.planIDFromHome = planID;
    //    // $scope.$emit('autoLoadEvent', planID);
    // }
    
});
