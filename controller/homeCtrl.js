app.controller('homeCtrl', function ($scope, $http, $compile, $rootScope, $location, $timeout, NgTableParams, filterFilter) {
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
            $scope.myPlanListAllMaster = response.data;

            $scope.userLogin = $rootScope.globals.currentUser.username;
            $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });

        });
    console.log($rootScope.globals.currentUser.username);
    $http.get("../api/plans/getPlans.php", {
        params: { inputBy: $rootScope.globals.currentUser.username }
    })
        .then(function (response) {
            console.log(response);
            if (response.data === "NO DATA") {
                console.log("no plan");
                $scope.myPlanList = {};


            } else {
                console.log("yes plan");
                $scope.myPlanList = response.data;
                $scope.myPlanListMaster = response.data;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList });


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

    $scope.filterTable = function (type) {
        var today = new Date();
        console.log($scope.myPlanList);
        $scope.filteredMyPlanList = [];
        $scope.filteredAllPlanList = [];
        console.log(type); 
        $scope.myPlanList =  $scope.myPlanListMaster;
                $scope.myPlanListAll =  $scope.myPlanListAllMaster;
        if (type == "upcoming") {
            console.log("upcoming");
            $scope.filteredMyPlanList = [];
            $scope.filteredAllPlanList = [];
            if ($scope.activeType == "upcoming") {
                $scope.activeType = "";
                $scope.filteredMyPlanList = [];
                $scope.filteredAllPlanList = [];
         
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList });
                $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });
            } else {
                $scope.activeType = "upcoming";
                $scope.myPlanList =  $scope.myPlanListMaster;
                $scope.myPlanListAll =  $scope.myPlanListAllMaster;
                $scope.myPlanList.forEach(item => {
                    if (new Date(item.tripStart) >= today) {
                        $scope.filteredMyPlanList.push(item);
                    }
                });
                $scope.myPlanListAll.forEach(item => {
                    if (new Date(item.tripStart) >= today) {
                        $scope.filteredAllPlanList.push(item);
                    }
                });
                $scope.myPlanList =  $scope.filteredMyPlanList;
                $scope.myPlanListAll =  $scope.filteredAllPlanList;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList });
                $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });
                console.log($scope.filteredAllPlanList);
                console.log($scope.filteredMyPlanList);
            }


        }else if(type=="current"){
            console.log("current");
            $scope.filteredMyPlanList = [];
            $scope.filteredAllPlanList = [];
            if ($scope.activeType == "current") {
                $scope.activeType = "";
                $scope.filteredMyPlanList = [];
                $scope.filteredAllPlanList = [];
                $scope.myPlanList =  $scope.myPlanListMaster;
                $scope.myPlanListAll =  $scope.myPlanListAllMaster;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList });
                $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });
            } else {
                $scope.activeType = "current";
                $scope.myPlanList =  $scope.myPlanListMaster;
                $scope.myPlanListAll =  $scope.myPlanListAllMaster;
                $scope.myPlanList.forEach(item => {
                    if (new Date(item.tripStart) <= today && today <= new Date(item.tripEnd)) {
                        $scope.filteredMyPlanList.push(item);
                    }
                });
                $scope.myPlanListAll.forEach(item => {
                    if (new Date(item.tripStart) <= today  && today <= new Date(item.tripEnd)) {
                        $scope.filteredAllPlanList.push(item);
                    }
                });
                $scope.myPlanList =  $scope.filteredMyPlanList;
                $scope.myPlanListAll =  $scope.filteredAllPlanList;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList });
                $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });
                console.log($scope.filteredAllPlanList);
                console.log($scope.filteredMyPlanList);
            }

        }else if(type=="past"){
            console.log("past");
            $scope.filteredMyPlanList = [];
            $scope.filteredAllPlanList = [];

            if ($scope.activeType == "past") {
                $scope.activeType = "";
                $scope.filteredMyPlanList = [];
                $scope.filteredAllPlanList = [];
                $scope.myPlanList =  $scope.myPlanListMaster;
                $scope.myPlanListAll =  $scope.myPlanListAllMaster;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList });
                $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });
            } else {
                $scope.activeType = "past";
                $scope.myPlanList.forEach(item => {
                    if (today >= new Date(item.tripEnd)) {
                        $scope.filteredMyPlanList.push(item);
                    }
                });
                $scope.myPlanListAll.forEach(item => {
                    if (today >=new Date(item.tripEnd) ) {
                        $scope.filteredAllPlanList.push(item);
                    }
                });
                $scope.myPlanList =  $scope.filteredMyPlanList;
                $scope.myPlanListAll =  $scope.filteredAllPlanList;
                $scope.tableParams = new NgTableParams({}, { dataset: $scope.myPlanList });
                $scope.tableParamsAll = new NgTableParams({}, { dataset: $scope.myPlanListAll });
                console.log($scope.filteredAllPlanList);
                console.log($scope.filteredMyPlanList);
            }

        }

    }
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
        $location.url('/viewPlan/' + id);
    };


    // function loadPlanToPlanCtrl($scope,planID) {
    //     console.log("loadPlanToPlanCtrl");
    //     $rootScope.planIDFromHome = planID;
    //    // $scope.$emit('autoLoadEvent', planID);
    // }

});
