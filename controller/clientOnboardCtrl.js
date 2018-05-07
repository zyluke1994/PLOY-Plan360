
app.controller('clientOnboardCtrl', ['$scope', '$http', '$compile', '$rootScope', 'uiGridConstants', function ($scope, $http, $compile, $rootScope, uiGridConstants) {
  console.log('inside clientOnboardCtrl');
  console.log('username in clientOnboardCtrl: ' + $rootScope.globals.currentUser.username);
  var dateNow = new Date();
  var userLogin = $rootScope.globals.currentUser.username;
  var userRole = $rootScope.globals.currentUser.role;

  function makePassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 12; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }



  $scope.isAdmin = false;
  if (userRole == "admin") {
    $scope.isAdmin = true;
    getCustomer();
    getPlanner();

  }
  getMyCustomer();
  // $scope.insertCustomerResponse="eee";
  function getCustomer() {
    $http.get("../api/customers/getCustomer.php")
      .then(function (response) {
        $scope.customerData = response.data;
      });             // The function returns the product of p1 and p2
  };
  function getPlanner() {
    $http.get("../api/customers/getCustomer.php", {
      params: {
        getType: "getPlanner",

      }
    })
      .then(function (response) {
        $scope.plannerData = response.data;
        console.log(response);
      });                // The function returns the product of p1 and p2
  }


  function getMyCustomer() {
    console.log("get my customer called");
    
    $http.get("../api/customers/getCustomer.php", {
      params: {
        inputBy: userLogin,
        getType: "getMyCustomers",

      }
    })
      .then(function (response) {
        $scope.myCustomerData = response.data;
        console.log(response);

      });             // The function returns the product of p1 and p2
  }
  $scope.myCustomerColumns = [
    { name: 'ID', field: 'customerID', enableCellEdit: false,width:50 },    
    { name: 'firstName', field: 'firstName', enableCellEdit: false },
    { name: 'lastName', field: 'lastName', enableCellEdit: false },
    // { name: 'email', field: 'email', enableCellEdit: false, width: 250 },
    // { name: 'phone', field: 'phone', enableCellEdit: false },
    { name: 'username', field: 'username', enableCellEdit: false },
    { name: 'customerNotes', field: 'customerNotes', enableCellEdit: false },
    { name: 'inputDate', field: 'inputDate', type: 'date', cellFilter: 'date:"medium"', enableCellEdit: false },
    { name: 'inputBy', field: 'inputBy', enableCellEdit: false },

  ]

  $scope.myCustomerGridOptions = {
    enableSorting: true,
    enableColumnResizing: true,
    enableFiltering: true,


    columnDefs: $scope.myCustomerColumns,
    data: 'myCustomerData',
  };


  $scope.customerColumns = [
    { name: 'ID', field: 'customerID', enableCellEdit: false,width:50  },        
    { name: 'firstName', field: 'firstName', enableCellEdit: false },
    { name: 'lastName', field: 'lastName', enableCellEdit: false },
    { name: 'email', field: 'email', enableCellEdit: true, width: 250 },
    { name: 'phone', field: 'phone', enableCellEdit: false },
    { name: 'occupancy', field: 'occupancy', enableCellEdit: false },
    { name: 'birthday', field: 'birthday', type: 'date', cellFilter: 'date:"mediumDate"', enableCellEdit: false },
    { name: 'rating', field: 'rating', enableCellEdit: false },
    { name: 'username', field: 'username', enableCellEdit: false },
    { name: 'customerNotes', field: 'customerNotes', enableCellEdit: false },
    { name: 'inputDate', field: 'inputDate', type: 'date', cellFilter: 'date:"medium"', enableCellEdit: false },
    { name: 'inputBy', field: 'inputBy', enableCellEdit: false },

  ]

  $scope.customerGridOptions = {
    enableSorting: true,
    enableColumnResizing: true,
    enableFiltering: true,


    columnDefs: $scope.customerColumns,
    data: 'customerData',
  };
  $scope.status = {};

  $scope.customerGridOptions.onRegisterApi = function (gridApi) {
    //set gridApi on scope
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      console.log(rowEntity);
      $scope.status.lastCellEdited = 'Edited ' + colDef.name + ' for ' + rowEntity.fullName + ' to ' + newValue + ' from ' + oldValue;
      $scope.updateCustomer(rowEntity, colDef, newValue);
      $scope.$apply();
    });
  };


  $scope.plannerColumns = [
    { name: 'ID', field: 'userID', enableCellEdit: false  },        
    { name: 'username', field: 'username', enableCellEdit: false },
    { name: 'role', field: 'role', enableCellEdit: false },
    { name: 'name', field: 'name', enableCellEdit: false},
    { name: 'activationKey', field: 'activationKey', enableCellEdit: false },
    { name: 'keyGivenBy', field: 'keyGivenBy', enableCellEdit: false },
    { name: 'email', field: 'email', enableCellEdit: false },
    { name: 'dateAdded', field: 'dateAdded', type: 'date', cellFilter: 'date:"medium"', enableCellEdit: false },

  ]

  $scope.plannerGridOptions = {
    enableSorting: true,
    enableColumnResizing: true,
    enableFiltering: true,


    columnDefs: $scope.plannerColumns,
    data: 'plannerData',
  };

  $scope.addPasswordCol = function () {
    if ($scope.passwordAuth == "password") {
      $scope.customerColumns.push({ name: 'password', field: 'password' });

    } else {
      alert("Wrong Password or Empty Password");
    }
  }

  $scope.updateCustomer = function (row, newValue) {
    $http.post(
      "../api/customers/updateCustomer.php", {
        'firstName': row.firstName,
        'lastName': row.lastName,
        'email': row.email,
        'phone': row.phone,
        'occupancy': row.occupancy,
        'rating': row.rating,
        'username': row.username,
        'password': row.password,
        'customerNotes': row.customerNotes,
        'inputBy': userLogin,
        'customerID': row.customerID

      }).then(function (response) {
        console.log(response);
        $scope.status.updateNotice = " ( " + response.data + " ) ";

      });


  }
  $scope.insertCustomer = function () {
    $scope.username = $scope.firstName + $scope.lastName + Math.floor(Math.random() * 10000).toString();
    console.log($scope.username);
    $scope.password = makePassword();
    $http.post(
      "../api/customers/insertCustomer.php", {
        'firstName': $scope.firstName,
        'lastName': $scope.lastName,
        'birthday': $scope.birthday,
        'email': $scope.email,
        'phone': $scope.phone,
        'occupancy': $scope.occupancy,
        'rating': $scope.rating,
        'username': $scope.username,
        'password': $scope.password,
        'customerNotes': $scope.customerNotes,
        'inputBy': userLogin,

      }
    ).then(function (response) {

      $scope.insertCustomerResponse = response.data;
      console.log(typeof response.data);
      if (!response.data.includes("Exists")) {
        clearTable();
        getMyCustomer();
        getCustomer();


      }
    })
  };

  function clearTable() {
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.birthday = "";
    $scope.email = "";
    $scope.phone = "";
    $scope.occupancy = "";
    $scope.rating = "";
    $scope.username = "";
    $scope.password = "";
    $scope.customerNotes = "";



  }

}]);
