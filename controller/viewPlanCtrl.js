
app.factory('sharedPlanService', function () { //future implementation : use sharedservice for mergedFinalList, php response sorted list
    var messages = {};

    messages.list = [];

    return messages;
});
app.controller('viewPlanCtrl', function ($scope, $http, $rootScope, $uibModal, $log, $document, $timeout, $location, $route, $compile, uiCalendarConfig, sharedPlanService, $window, $ngConfirm, sendEmailService, Upload, $routeParams) {
    console.log('inside viewPlanCtrl');
    console.log($routeParams.tripid);
    if ($rootScope.globals.currentUser.role === "admin") {
        $scope.isAdmin = true;
    }
   

    console.log("username: " + $rootScope.globals.currentUser.username);
    $scope.bannerPlan = false;
    $scope.download = false;
    $scope.reviewNotApproved = true;
    $scope.showDenialMessage = false;
    $scope.disableReviewButton = false;
    $scope.requestReviewButtonText = "Request Review";
    $scope.showDestinationMsg = "Trip Info & Documents";
    $scope.attractionPanel = false;
    $scope.showSearchResult = false;
    $scope.showNoAttractionFound = false;
    $scope.selectedDayItem = [];
    $scope.dailyHeadingTitle = "Trip Info & Documents";
    $scope.showDestinationInfo = true;
    $scope.isActive = false;
    $scope.activeItemIndex = -1;
    if($routeParams.tripid !="" || $routeParams.tripid !=undefined){
        $rootScope.planIDFromHome = $routeParams.tripid;
        $scope.attractionPanel = true;
    }
    
    
    $scope.showSelectedDay = function(selectedDayItem, activeItemIndex){
        $scope.showDestinationInfo = false;
        $scope.activeItemIndex = activeItemIndex;
        $scope.selectedDayItem = selectedDayItem;
        $scope.dailyHeadingTitle = "Day "+($scope.processByDateList.indexOf(selectedDayItem)+1)+" - "+moment(selectedDayItem.dateList).format('MMM DD YYYY');        ;
    }
    $scope.searchAttraction = function (searchAnyText) {
        console.log(searchAnyText);
        $http.get("../api/attractions/searchAttraction.php", {
            params: { searchAny: searchAnyText }
        })

            .then(function (response) {
                console.log(response);
                if (response.data === "  ") {
                    console.log("empty")
                    $scope.showNoAttractionFound = true;
                } else {
                    $scope.searchResult = response.data;
                    $scope.showSearchResult = true;
                    $scope.showNoAttractionFound = false;


                }
                console.log($scope.searchResult);
            });
    };
    // $scope.clearSearchAttraction = function(){
    //     console.log("clear");
    //     console.log($scope.searchAnyText);

    //     $scope.showSearchResult=false;
    //     $scope.showNoAttractionFound = false;        
    //     $scope.searchAnyText="";
    // }
    $scope.addNewAttraction = function () {
        $location.url('/inputAttraction');
    };


    $scope.toggleAttractionPanel = function () {
        console.log("open attraction panel")
        $scope.attractionPanel = !$scope.attractionPanel;
        if ($scope.attractionPanel == true) {
            document.getElementById('list_view').setAttribute("style", "margin-right:305px");

            // $scope.searchAttraction("");
        }
        else {
            document.getElementById('list_view').setAttribute("style", "margin-right:0px");

        }

    }

    $scope.getSharableCode = function (planSelected, customerSelected) {
        console.log("getSharableCode");
        var customer = (customerSelected.customerID).toString();
        var customerLength = customer.length;
        if(customerLength<10){
            var formattedNumber = ("0" + customerLength).slice(-2);
            console.log(formattedNumber);
            var customerLength = formattedNumber;
        }

        var plan = planSelected.planID;
        $scope.copied = false;
        $scope.code = customer+plan+customerLength;
        console.log("getSharableCode: "+ $scope.code );

        $scope.code = parseInt($scope.code*2+123);
        console.log("getSharableCode post: "+ $scope.code );

        $scope.tripURL = "http://myguide.ploytrip.com/#!/trip/";

        $ngConfirm({
            title: 'Share the Plan',
            content: '<div style="text-align:center;"><p>Code for this plan:</p><h2>{{code}}</h2> <br><p>Share below link with code above:<br> <a href="http://myguide.ploytrip.com/#!/trip">http://myguide.ploytrip.com/#!/trip</a></p><p style="color:green;" ng-if="copied"><span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>Copied</p></div>',
            scope: $scope,
            buttons: {
                copyCode: {
                    text: 'Copy Code',
                    btnClass: 'btn-blue',
                    action: function(scope, button){
                        $scope.CopyTextToClipboard($scope.code);
                        return false; // prevent close;
                    }
                },
                copyLink: {
                    text: 'Copy URL',
                    btnClass: 'btn-orange',
                    action: function(scope, button){
                        $scope.CopyTextToClipboard($scope.tripURL);
                        return false; // prevent close;
                    }
                },
                close: function(scope, button){
                    // closes the modal
                },
            }
        });


    };
    $scope.CopyTextToClipboard = function(text) {
 
        var TextAreaElement = document.createElement("textarea");
     
        // Place in outside of the visible area of the screen regardless of scroll position.
        TextAreaElement.style.position = 'absolute';
        TextAreaElement.style.top = -100;
        TextAreaElement.style.left = 0;
        
        // add text to the textbox
        TextAreaElement.value = text;
     
        // append TextAreaElement to document
        document.body.appendChild(TextAreaElement);
     
        // select the content
        TextAreaElement.select();
     
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text "' + text + '" to clipboard was ' + msg);
            if(successful){
                $scope.copied = true;
            }
        } catch (err) {
            console.log('Cannot copy to clipboard');
        }
     
        // remove the TextAreaElement from the document
        document.body.removeChild(TextAreaElement);
     
        // unload
        TextAreaElement = undefined;
    }
    $scope.openEditAttractionModal = function (size, attractionSelected, parentSelector) {
        console.log("open");
        console.log(attractionSelected);

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/viewAttractionModal.html',
            controller: 'viewAttractionModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                attractionSelected: function () {
                    return attractionSelected;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.openAddToPlanModal = function (size, attractionSelected, parentSelector) {
        console.log("open");
        console.log(attractionSelected);
        console.log($scope.planSelected);

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/addToPlanModal.html',
            controller: 'addToPlanModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                attractionSelected: function () {
                    return attractionSelected;
                },
                prePlanSelected: function () {
                    return $scope.planSelected;
                },
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
            console.log("insert done1");
            $scope.getSelectedPlanEntries();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });


    };
 
    $scope.showDestinationMsgBtn = function () {
        $scope.showDestinationInfo = true;
        $scope.activeItemIndex = -1;
        $scope.dailyHeadingTitle = "Trip Info & Documents";

        // if ($scope.showDestinationMsg === "Show Destination Info") {
        //     $scope.showDestinationMsg = "Hide Destination Info";

        // } else {
        //     $scope.showDestinationMsg = "Show Destination Info";

        // }
    }
    // playground requires you to assign document definition to a variable called dd
    $scope.destinationInfo = {
        briefing: 'Briefing here... ',
        flights: 'N/A!',
        accomodations: 'N/A',
        packing: 'Clothes \nShoes \nLaptop',
        aboutDestination: 'About goes here... ',
        weather: 'Weather',
        dressing: 'Dressing',
        payments: 'Payments',
        electronics: 'Electronics',
        medical: 'Medical',
        timeZone: 'Time Zone',
        language: 'Language',
        transportation: 'Transportation',
        telecommunication: 'Telecommunication',
        hotel: 'Hotel',
        shopping: 'Shopping',
        electricity: 'Electricity',
        drinkingWater: 'Drinking Water',
        dining: 'Dining',
        tips: 'Tips',
        publicAreas: 'Public Areas',
        culture: 'Culture',
        religion: 'Religion',
        borderSecurity: 'Border Security',
        safety: 'Safety',
        driving: 'Driving',
        locals: 'Locals',
        usefulPhone: 'Useful Phone Numbers',
        others: 'Others',
        suggestions: 'Awesome user \ndescription!',


    };
    $scope.planSelectedBackup;
    $scope.importTemplate = function (templateSelected) {
        console.log(templateSelected);
        console.log($scope.planSelected);
        $scope.showDestinationInfo = true;
        $scope.activeItemIndex = -1;
        // $scope.planSelectedBackup = angular.copy($scope.planSelected);

        Object.keys(templateSelected).forEach(function (k) {
            console.log(k + ' - ' + templateSelected[k]);
            Object.keys($scope.planSelected).forEach(function (k2) {

                if (k === k2) {
                    $scope.planSelected[k2] = templateSelected[k];
                }
            })
        });

        // $scope.planSelected = templateSelected;
        console.log($scope.planSelected);


    }
    // $scope.cancelChanges = function(){
    //     console.log($scope.planSelected);
    //     console.log($scope.planSelectedBackup);

    //     // $scope.planSelected =  $scope.planSelectedBackup;
    //     Object.keys($scope.planSelectedBackup).forEach(function(k){
    //         Object.keys($scope.planSelected).forEach(function(k2){

    //         if(k===k2){
    //             $scope.planSelected[k2]=$scope.planSelectedBackup[k];
    //         }
    //     })
    //     });
    // };
    $scope.updatePlan = function (plan, destinationInfoin) {
        console.log("update" + plan.tripName);



        $http.post(
            "../api/plans/updatePlan.php", {
                'planID': plan.planID,
                'briefing': $scope.planSelected.briefing,
                'aboutDestination': $scope.planSelected.aboutDestination,
                'packing': $scope.planSelected.packing,
                'dressing': $scope.planSelected.dressing,
                'weather': $scope.planSelected.weather,
                'payments': $scope.planSelected.payments,
                'electronics': $scope.planSelected.electronics,
                'medical': $scope.planSelected.medical,
                'timeZone': $scope.planSelected.timeZone,
                'language': $scope.planSelected.language,
                'transportation': $scope.planSelected.transportation,
                'telecommunication': $scope.planSelected.telecommunication,
                'hotel': $scope.planSelected.hotel,
                'shopping': $scope.planSelected.shopping,
                'electricity': $scope.planSelected.electricity,
                'drinkingWater': $scope.planSelected.drinkingWater,
                'dining': $scope.planSelected.dining,
                'tips': $scope.planSelected.tips,
                'publicAreas': $scope.planSelected.publicAreas,
                'culture': $scope.planSelected.culture,
                'religion': $scope.planSelected.religion,
                'borderSecurity': $scope.planSelected.borderSecurity,
                'safety': $scope.planSelected.safety,
                'driving': $scope.planSelected.driving,
                'locals': $scope.planSelected.locals,
                'usefulPhone': $scope.planSelected.usefulPhone,
                'others': $scope.planSelected.others,
                'suggestions': $scope.planSelected.suggestions,
                'updateType': "updateDestinationInfo"

            }
        ).then(function (response) {
            $scope.saveTemplateToPlanText = response.data;
            console.log("Data Updated");

        });


    };

    $scope.prompt = function () {

    };

    $scope.approveReview = function (planSelected, customerSelected, reviewID) {
        $scope.reviewNotApproved = true;
        console.log($scope.reviewObject);
        console.log(customerSelected.email);
        console.log(planSelected);

        $scope.reviewRequested = true;
        var dateNow = new Date();


        if (customerSelected.email == "") {
            $ngConfirm({
                title: 'Email needed for ' + customerSelected.fullName,
                contentUrl: '../view/modal/emailForm.html',
                buttons: {
                    updateEmail: {
                        text: 'Update',
                        disabled: true,
                        btnClass: 'btn-green',
                        action: function (scope) {
                            $http.post(
                                "../api/customers/updateCustomer.php", {
                                    'email': scope.emailInput,
                                    'updateType': "emailChange",
                                    'customerID': customerSelected.customerID
                                }).then(function (response) {
                                    console.log(response);
                                    //   $scope.status.updateNotice = " ( "+response.data+ " ) ";
                                    $ngConfirm(customerSelected.fullName + ' email updated to: <strong>' + scope.emailInput + '</strong>' + 'customer id:' + customerSelected.customerID);

                                });
                        }
                    },
                    // later: function () {
                    // }
                },
                onScopeReady: function (scope) {
                    var self = this;
                    scope.textChange = function () {
                        if (scope.emailInput)
                            self.buttons.updateEmail.setDisabled(false);
                        else
                            self.buttons.updateEmail.setDisabled(true);
                    }
                }
            });
        }


        $http.post(
            "../api/planReview/updatePlanReview.php", {
                'reviewID': $scope.reviewObject[0].reviewID,
                'planToReviewID': planSelected.planID,
                'reviewer': $rootScope.globals.currentUser.username,
                'status': "APPROVED",
                'reviewedDate': dateNow,
                'statusNotes': "",
                'updateType': 'updateStatus'

            }
        ).then(function (response) {
            $scope.insertPlanResponse = response.data;
            console.log("Data updated");
            var emailSubject = "PLOY Plan " + planSelected.planID + " Approved";
            var emailContent = "<p>Dear " + planSelected.plannerName + ", <br><br> Your plan <strong> " + planSelected.planID + " </strong> [" + planSelected.tripName + "] for <strong> " + customerSelected.fullName + " </strong> has been APPROVED. <br><br> Please proceed with sending the plan to your client at your earliest convenience (within 24 hours). <br><br> Regards, <br><br> PLOY Review Team </p> <br><br><br><br> <hr>***This is an auto-generated email, please do not reply.***";
            var recepientEmail = planSelected.plannerEmail;
            var recepientName = planSelected.plannerName;
            var senderName = "";
            var senderEmail = "";
            console.log(planSelected);

            console.log(recepientEmail);
            console.log(recepientName);
            console.log(sendEmailService.sendEmailNoAttachment(emailSubject, emailContent, recepientEmail, recepientName, senderName, senderEmail));

            $scope.requestReviewText = "Approved";
            $scope.reviewNotApproved = false;
        })

    };
    $scope.denyReview = function (planSelected, customerSelected, reviewID) {

        while (!$scope.denyReason) {
            $scope.denyReason = prompt('Reason for denial?');
        };

        $scope.reviewNotApproved = true;
        console.log($scope.reviewObject);
        console.log($scope.denyReason);

        $scope.reviewRequested = true;
        var dateNow = new Date();
        $http.post(
            "../api/planReview/updatePlanReview.php", {
                'reviewID': $scope.reviewObject[0].reviewID,
                'planToReviewID': planSelected.planID,
                'reviewer': $rootScope.globals.currentUser.username,
                'status': "DENIED",
                'reviewedDate': dateNow,
                'statusNotes': $scope.denyReason,
                'updateType': 'updateStatus'

            }
        ).then(function (response) {
            $scope.insertPlanResponse = response.data;
            console.log("Data updated");
            var emailSubject = "PLOY Plan " + planSelected.planID + " DENIED";
            var emailContent = "<p>Dear " + planSelected.plannerName + ", <br><br> Your plan <strong> " + planSelected.planID + " </strong> [" + planSelected.tripName + "] for <strong> " + customerSelected.fullName + " </strong> has been DENIED. <br><br> REASON: " + $scope.denyReason + " <br><br> Please make appropriate modifications and resubmit the request at your earliest convenience. Should you have any questions, you may contact reviewer directly at <a href='mailto:" + $rootScope.userEmail + "'>" + $rootScope.userEmail + ".</a> <br><br> Regards, <br><br> PLOY Review Team </p> <br><br><br><br> <hr>***This is an auto-generated email, please do not reply.***";
            var recepientEmail = planSelected.plannerEmail;
            var recepientName = planSelected.plannerName;
            var senderName = "";
            var senderEmail = "";

            console.log(sendEmailService.sendEmailNoAttachment(emailSubject, emailContent, recepientEmail, recepientName, senderName, senderEmail));

            $scope.requestReviewText = "Denied";
            $scope.reviewNotApproved = true;
            $scope.reviewObject[0].statusNotes = $scope.denyReason;
            $scope.showDenialMessage = true;
        })

    }


    $scope.requestReview = function (planSelected, customerSelected) {
        $scope.reviewNotApproved = true;
        $scope.reviewRequested = true;
        var dateNow = new Date();
        $http.post(
            "../api/planReview/insertPlanReview.php", {
                'planToReviewID': planSelected.planID,
                'planName': planSelected.tripName,
                'clientID': customerSelected.customerID,
                'clientName': customerSelected.fullName,
                'requester': $rootScope.globals.currentUser.username,
                'reviewer': "",
                'status': "REQUESTED",
                'requestedDate': dateNow,
                'reviewedDate': "",
                'statusNotes': "",
                'valid': "TRUE",

            }
        ).then(function (response) {
            $scope.insertPlanResponse = response.data;
            console.log("Data Inserted");
            $scope.requestReviewText = "Pending Review";
            $scope.showDenialMessage = false;



        })

    }
    $scope.getReviewTextStyle = function (reviewText) {
        if (reviewText == "Denied") {
            $scope.disableReviewButton = false;
            $scope.showDenialMessage = true;
            $scope.requestReviewButtonText = "Resubmit Review Request";
            return { 'color': '#ffb3b3' };
        }
        if (reviewText == "Pending Review") {
            $scope.disableReviewButton = true;
            $scope.showDenialMessage = false;
            $scope.requestReviewButtonText = "Request Review";
            return { 'color': '#ffdd99' };
        }
        if (reviewText == "Approved") {
            $scope.disableReviewButton = false;
            $scope.showDenialMessage = false;
            $scope.requestReviewButtonText = "Resubmit Review Request";
            return { 'color': '#99e699' };
        }
        if (reviewText == "Review Not Requested") {
            $scope.disableReviewButton = false;
            $scope.showDenialMessage = false;
            $scope.requestReviewButtonText = "Request Review";
            return { 'color': '#85e1f2' };
        }

    }

    $scope.viewPDF = function (download, chinese) {
        console.log($scope);


        pdfMake.fonts = {
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
            },
            Chinese: {
                normal: 'SongtiReg.ttf',
                bold: 'SongtiBold.ttf',
                italics: 'SongtiReg.ttf',
                bolditalics: 'SongtiBold.ttf'
            }
        };

        function getBase64FromImageUrl(url) {
            console.log("getBase64FromImageUrl: "+url)
            var img = new Image();
            var dataURL;
            img.setAttribute('crossOrigin', 'anonymous');

            img.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);

                dataURL = canvas.toDataURL("image/png");

                dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                $scope.imageDataURL = dataURL;
                console.log(dataURL);


            };


            img.src = url;

        }

        var daily = [];


        function generateDaily() {
            //todo: sort
            $scope.processByDateList = _.sortBy($scope.processByDateList, function (o) {

                var day = moment(o.dateList);

                return day;

            })

            $scope.processByDateList.forEach(function (e) {
                e.content = _.sortBy(e.content, function (o2) {
                    var time = moment(o2.visitStart);
                    console.log(time);
                    return time;
                });

                // if (download == true) {
                    daily.push({ text: moment(e.dateList).format("dddd, LL"), style: ['time', 'right_align'] }, );
                // } else {
                //     daily.push({ text: moment(e.dateList).format("dddd, LL"), style: ['time', 'right_align'] }, 
                //     { canvas: [{ color: '#605885', type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }] });
                // }
                daily.push({ text: '\n' }, );
                e.content.forEach(function (e2) {
                    daily.push(
                        {
                            text: [
                                { text: moment(e2.visitStart).format("LT") + ' - ' + moment(e2.visitEnd).format("LT"), style: 'standard' },
                                { text: " | " + e2.attractionName, style: 'name' },

                            ]
                        },

                        {
                            text: [
                                { text: 'Address: ', bold: true },
                                { text: e2.address, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Phone: ', bold: true },
                                { text: e2.phone, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Website: ', bold: true },
                                { text: e2.website, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Hours: ', bold: true },
                                { text: e2.hours, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Parking: ', bold: true },
                                { text: e2.parkingInfo, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'GPS: ', bold: true },
                                { text: e2.GPSCoordinates, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Notes: ', bold: true, italics: true },
                                { text: e2.notes, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Memo: ', bold: true, italics: true },
                                { text: e2.planEntryMemo, style: 'standard' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Details: ', bold: true, italics: true },
                                { text: e2.description + '\n\n', style: 'standard' },
                            ]
                        },
                    )
                });
                daily.push({ text: '\n\n' }, );

            });

        }
        generateDaily();
        console.log(daily);
        var style = "Roboto";
        console.log(chinese);
        if (chinese == true) {
            style = 'Chinese';
        } else {
            style = 'Roboto';
        }
        function convertImage(imagePath){
            $http.get("../../api/imageConverter.php",{
                params: { imagePath: "../assets/ploy_purple_orange.png" }
            })
                .then(function (response) {
                    console.log(response.data);   
                    $scope.logoDataURL = response.data;
                    return response.data;
                })
        };
       console.log($scope.logoDataURL);

        var docDefinition = {

            defaultStyle: {
                font: style
            },

            header: {
                margin: 10,
                columns: [
                    {
                        // usually you would use a dataUri instead of the name for client-side printing
                        // sampleImage.jpg however works inside playground so you can play with it
                        image: "data:image/png;base64,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",
                        width: 40,
                        margin: [30,10,0,0]
                    },
                    {
                        margin: [2, 0, 0, 0],
                        fontSize: 9,
                        text: $scope.planSelected.tripName + ' | © Ploy Trip 2017 ',
                        style: 'right_align'
                    }
                ]
            },
            content: [
                {
                    text: 'PLOY Travel Plan for ' + $scope.customerSelected.fullName + '\n\n',
                    style: 'header'
                },

                {
                    text: [

                        {
                            text: moment($scope.planSelected.tripStart).format("LL") + ' - ' + moment($scope.planSelected.tripEnd).format("LL") + " | "
                                + $scope.planSelected.tripOrigin + ", " + $scope.planSelected.tripStops + ", " + $scope.planSelected.tripFinalDestination + "\n\n"
                        },
                        { text: 'Notes: ', italics: true, bold: true },
                        { text: $scope.planSelected.notes, italics: true },
                        '\n\n'
                    ]

                },
                { text: 'About Your Trip', style: 'subheader' },
                {
                    text: [
                        { text: $scope.planSelected.briefing }, '\n\n'
                    ]
                },
                { text: 'Recommended Packing List', style: 'subheader' },
                {
                    text: [
                        { text: $scope.planSelected.packing }, '\n\n'
                    ]
                },
                { text: 'About Your Destination', style: 'subheader' },
                {
                    text: [
                        { text: $scope.planSelected.aboutDestination }, '\n\n'
                    ]
                },
                { text: 'Weather', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.weather }, '\n\n'
                    ]
                },
                { text: 'Clothing', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.dressing }, '\n\n'
                    ]
                }, { text: 'Payments', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.payments }, '\n\n'
                    ]
                }, { text: 'Electronics', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.electronics }, '\n\n'
                    ]
                }, { text: 'Telecommunication', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.telecommunication }, '\n\n'
                    ]
                }, { text: 'Time Zone', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.timeZone }, '\n\n'
                    ]
                }, { text: 'Language', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.language }, '\n\n'
                    ]
                }, { text: 'Medical', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.medical }, '\n\n'
                    ]
                }, { text: 'Transportation', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.transportation }, '\n\n'
                    ]
                }, { text: 'Hotel', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.hotel }, '\n\n'
                    ]
                }, { text: 'Dining', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.dining }, '\n\n'
                    ]
                }, { text: 'Tips', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.tips }, '\n\n'
                    ]
                }, { text: 'Shopping', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.shopping }, '\n\n'
                    ]
                }, { text: 'Power Outlets', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.electricity }, '\n\n'
                    ]
                }, { text: 'Drinking Water', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.drinkingWater }, '\n\n'
                    ]
                }, { text: 'Public Etiquette', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.publicAreas }, '\n\n'
                    ]
                }, { text: 'Culture', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.culture }, '\n\n'
                    ]
                }, { text: 'Religion', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.religion }, '\n\n'
                    ]
                }, { text: 'Border Security', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.borderSecurity }, '\n\n'
                    ]
                }, { text: 'Safety', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.safety }, '\n\n'
                    ]
                }, { text: 'Driving', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.driving }, '\n\n'
                    ]
                }, { text: 'Locals', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.locals }, '\n\n'
                    ]
                }, { text: 'Useful Phone Numbers', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.usefulPhone }, '\n\n'
                    ]
                }, { text: 'Others', style: 'subheader_inner' },
                {
                    text: [
                        { text: $scope.planSelected.others }, '\n\n'
                    ]
                },
                { text: 'We Recommend', style: 'subheader' },
                {
                    text: [
                        { text: $scope.planSelected.suggestions, color: '#605885' }, '\n\n\n'
                    ]
                },

                { text: 'Daily Breakdowns \n', style: 'subheader' },

                daily
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                name: {
                    fontSize: 13,
                    bold: true,
                    color: '#ff941e'
                },
                time: {
                    fontSize: 13,
                    bold: true,
                    color: '#605885'
                },
                subheader: {
                    fontSize: 14,
                    bold: true
                },
                standard: {
                    fontSize: 11,
                },
                subheader_inner: {
                    fontSize: 13,
                    bold: true,
                    italics: true,
                    color: '#303030'
                },
                right_align: {
                    alignment: 'right',
                }

            }
        }


        pdfMake.createPdf(docDefinition).open();
        // if (download == true) {
        // pdfMake.createPdf(docDefinition).download($scope.customerSelected.lastName + '_' + $scope.customerSelected.firstName + '_ploy_plan' + $scope.planSelected.planID + '_' + moment().format("MMDDYY") + '_' + moment().format("HHmm") + '.pdf');
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBlob((blob) => {
            console.log(blob);
            var file = new File([blob], $scope.customerSelected.lastName + '_' + $scope.customerSelected.firstName + '_ploy_plan' + $scope.planSelected.planID + '_' + moment().format("MMDDYY") + '_' + moment().format("HHmm") + '.pdf');
            console.log(file);
            Upload.upload({
                url: '../api/fileUpload.php',
                method: 'POST',
                file: file,
                data: {
                    'targetPath': '../assets/Uploads/plan/',
                    'filenameDetail': 'Plan_Entry_'
                    //^--to go back one directory and into different directory
                }
            }).then(function (response) {
                console.log(response);
                $scope.finalFileName = "Plan_Entry_"+$scope.customerSelected.lastName + '_' + $scope.customerSelected.firstName + '_ploy_plan' + $scope.planSelected.planID + '_' + moment().format("MMDDYY") + '_' + moment().format("HHmm") + '.pdf';
                console.log($scope.finalFileName);
                $http.post(
                    "../api/plans/updatePlan.php", {
                        'planID': $scope.planSelected.planID,
                        'planFileLocation':$scope.finalFileName,
                        'updateType': "updatePlanFileLocation"
                    }
                ).then(function (response) {
                    console.log("Data Updated");
                });
            });
        });


    }

    $http.get("../api/customers/getCustomer.php")
        .then(function (response) {
            $scope.customerList = response.data;
        });
    $http.get("../api/destinationPlanInfoTemplate/getTemplate.php")
        .then(function (response) {
            $scope.templateList = response.data;
            console.log($scope.templateList);

        });
    $http.get("../api/attractions/getAttraction.php")
        .then(function (response) {
            $scope.attractionList = response.data;
        });

    getDateRange = function (startDate, endDate) {
        var start = new Date(startDate);
        // console.log(start);

        var end = new Date(endDate);
        // console.log(end);

        var tripDateRange = [];
        mil = 86400000 //24h
        for (var i = start.getTime(); i < end.getTime(); i = i + mil) {
            tripDateRange.push(new Date(i))
        }
        return tripDateRange;
    };
    $scope.ifAccomodation = function (category) {
        if (category == "Accommodations") {
            return true;


        }
    }
    $scope.ifFoodDrinks = function (category) {
        if (category == "Food and Drinks") {
            return true;
        }
    }
    $scope.getPlanHotelInfo = function (city, checkin, checkout) {
        $scope.inputPlanHotelCity = city;
        $scope.inputPlanHotelCheckin = checkin.substring(0, 10);
        $scope.inputPlanHotelCheckout = checkout.substring(0, 10);
        $scope.inputPlanHotelRoomNum = 1;
        $scope.inputPlanHotelGuestNum = 2;

    }
    $scope.getRestaurantInfo = function (city, name, checkin) {
        console.log(checkin);
        $scope.inputPlanRestaurantCity = city;
        $scope.inputPlanRestaurantCheckinDate = checkin.substr(0, 10);
        $scope.inputPlanRestaurantCheckinTime = checkin.substr(11, 5);
        $scope.inputPlanRestaurantName = name;
        $scope.inputPlanRestaurantGuestNum = 2;

        console.log("checkinTime = " + $scope.inputPlanRestaurantCheckinTime);

    }
    $scope.searchRestaurant = function (city, name, checkinDate, checkinTime, guestNum) {
        // city = city.replace(/ /g, "_");

        // $http.get("http://opentable.herokuapp.com/api/restaurants?name=casa%20nonna").then(function (response) {
        //     $scope.restaurantResult = response.data;
        // });
        $.getJSON('https://opentable.herokuapp.com/api/restaurants?name=' + name, function (data) {

            console.log(data);
            console.log(checkinDate);
            if (data.total_entries < 1) {
                console.log("Opentable not found");
                $scope.opentableWarning = "Error: Restaurant not found on Opentable. Please search for the restaurant manually";
            } else {
                $scope.restaurantID = data.restaurants[0].id;
                console.log($scope.restaurantID);
                $scope.restaurantReserveURL = data.restaurants[0].reserve_url;
                console.log($scope.restaurantReserveURL + "?st=Standard&datetime=" + checkinDate + "%20" + checkinTime.substr(0, 2) + "%3A" + checkinTime.substr(3, 2) + "&p=" + guestNum);
                $window.open($scope.restaurantReserveURL + "?st=Standard&datetime=" + checkinDate + "%20" + checkinTime.substr(0, 2) + "%3A" + checkinTime.substr(3, 2) + "&p=" + guestNum);

            }

        });

    };

    $scope.searchHotel = function (city, checkin, checkout, roomNum, guestNum) {
        city = city.replace(/ /g, "_");


        if (checkin === checkout) {
            console.log($scope.inputPlanHotelCity);
            console.log(checkin);

            console.log(checkout);

            console.log("matched checkin checkoout date");

        } else {
            $window.open("https://brands.datahc.com/Hotels/Search?a_aid=178887&brandid=528381&destination=place:" + city + "&radius=0mi&checkin=" + checkin + "&checkout=" + checkout + "&Rooms=" + roomNum + "&adults_1=" + guestNum + "&pageSize=15&pageIndex=0&sort=Popularity-desc&showSoldOut=true&scroll=2374&HotelID=&mapState=expanded%3D0", '_blank');
        }
    };

    $scope.searchBooking = function (city, checkin, checkout, roomNum, guestNum) {
        city = city.replace(/ /g, "_");


        if (checkin === checkout) {
            console.log($scope.inputPlanHotelCity);
            console.log(checkin);
            console.log(checkout);
            console.log("matched checkin checkoout date");
        } else {
            console.log(checkin.substr(5, 2));
            console.log(checkin.substr(8, 2));
            console.log(checkin.substr(0, 4));
            console.log(checkout);
            $window.open("https://www.booking.com/searchresults.en-us.html?aid=1143925&ss=" + city + "&checkin_month=" + checkin.substr(5, 2) + "&checkin_monthday=" + checkin.substr(8, 2) + "&checkin_year=" + checkin.substr(0, 4) +
                "&checkout_month=" + checkout.substr(5, 2) + "&checkout_monthday=" + checkout.substr(8, 2) + "&checkout_year=" + checkout.substr(0, 4) + "&group_adults=" + guestNum + "&group_children=0&no_rooms=" + roomNum + "&ss_raw=" + city + "&dest_type=city");

        }
    };
    $scope.isAllDateOpen = false;
    $scope.myDateSortFunction = function (dateOpen) {
        return new Date(dateOpen.dateList);
    };
    $scope.mergeList = function () {
        //map attraction based on planEntry
        console.log($scope.filteredPlanEntryList);

        $scope.mergedFinalList = _.map($scope.filteredPlanEntryList, function (item) {
            // var findWhere = _.findWhere($scope.filteredAttractionList, { 'attractionID': item.attractionID });
            // var extend = _.extend(item,findWhere);
            // return extend;


            return _.extend(item, _.findWhere($scope.filteredAttractionList, { 'attractionID': item.attractionID }));
        });



        //  console.log($scope.mergedFinalList);
    };
    $scope.groups = [
        {
            title: "Dynamic Group Header - 1",
            items: [{ "item-title": "item 1" }, { "item-title": "item 2" }]
        },
        {
            title: "Dynamic Group Header - 2",
            items: [{ "item-title": "item 3" }, { "item-title": "item 4" }]
        }
    ];
    $scope.processListByDate = function () {
        // $scope.processPlanStatus = 0;
        // $scope.processPlanStatusMax = $scope.filteredPlanEntryList.length;

        $scope.processByDateList = [];

        $scope.mergedFinalList.forEach(function (item) {
            // $scope.processPlanStatus = $scope.processPlanStatus + 1;

            var date = new Date(item.visitStart).toDateString();
            var obj = {};
            obj["content"] = [];
            obj["dateList"] = new Date(date).toString();
            if (_.findWhere($scope.processByDateList, { dateList: new Date(date).toString() })) {
                _.findWhere($scope.processByDateList, { dateList: new Date(date).toString() }).content.push(item);
            } else {
                obj["content"].push(item);
                $scope.processByDateList.push(obj);

            }
        });

        console.log( $scope.processByDateList);
        // $timeout(function () { $scope.processPlanStatusBar = false; }, 2500);
        $timeout(function () { $scope.dataLoading = false; }, 2500);


    };

    $scope.getSelectedPlanEntries = function () {
        console.log("getSelectedPlanEntries clicked");
        // $scope.processPlanStatusBar = true;
        // $scope.activeJustified=0;


        $scope.filteredPlanEntryList = [];
        $scope.filteredAttractionList = [];

        // $scope.tripDateRange = getDateRange($scope.planSelected.tripStart, $scope.planSelected.tripEnd);
        if ($rootScope.planIDFromHome != undefined) {
            $scope.dataLoading = true;
            $scope.accordionDetails = true;
            $scope.bannerPlan = true;
            $scope.requestReviewText = "Review Not Requested";
            $scope.reviewRequested = false;
            $scope.planSelected = {};
            $scope.clientIDSelected ="";
            console.log("yes planID from home");
            $scope.planSelected.planID = $rootScope.planIDFromHome;
            $http.get("../api/plans/getPlans.php", {
                params: { planID: $rootScope.planIDFromHome }
            }).then(function (response) {
                $scope.planSelected = response.data[0];
                $scope.clientIDSelected = response.data[0].customerID;
                console.log(response.data);
                $http.get("../api/customers/getCustomer.php", {
                    params: { customerID: $scope.clientIDSelected }
                }).then(function (response) {
                    // console.log("Get customer selected from database" + $scope.reviewObject.clientID);
                    console.log(response.data);
                    if(response.data[0].customerID != $scope.clientIDSelected ){
                        console.log("Customer Not Match, Skipping");
    
                    }else{
                        $scope.customerSelected = response.data[0];
                        console.log("Customer selected 2");
                    console.log($scope.customerSelected);
                    }
                   
                });
            });
            console.log($scope.clientIDSelected);
          
            $http.get("../api/planReview/getPlanReview.php", {
                params: { planToReviewID: $rootScope.planIDFromHome }
            })
                .then(function (response) {
                    console.log("load from home, plan ID: " + $rootScope.planIDFromHome)
                    if (response.data[0].status === "REQUESTED" && response.data[0].valid === "TRUE") {
                        $scope.requestReviewText = "Pending Review";
                        $scope.reviewRequested = true;

                    } else if (response.data[0].status === "APPROVED" && response.data[0].valid === "TRUE") {
                        $scope.requestReviewText = "Approved";
                        $scope.reviewRequested = true;
                        $scope.reviewNotApproved = false;

                    }
                    else if (response.data[0].status === "DENIED" && response.data[0].valid === "TRUE") {
                        $scope.requestReviewText = "Denied";
                        $scope.reviewRequested = true;
                        $scope.reviewNotApproved = true;
                        // $scope.denialMessage = response.data[0].statusNotes; 
                        $scope.showDenialMessage = true;


                    }
                    console.log(response);
                    $scope.reviewObject = response.data;


                });

            $http.get("../api/planEntry/getPlanEntry.php")
                .then(function (response) {
                    $scope.planEntryList = response.data;
                    $scope.userLogin = $rootScope.globals.currentUser.username;
                    $scope.planEntryList.forEach(function (item) {
                        if ($scope.planSelected.planID == item.planID) {
                            // console.log("MATCH: " + $scope.planSelected.planID + ":" + item.planID);
                            $scope.filteredPlanEntryList.push(item);
                            // $scope.filteredPlanEntryList.push(item);
                            $http.get("../api/attractions/getAttraction.php", {
                                params: { attractionID: item.attractionID }
                            })
                                .then(function (response) {
                                    // console.log("GET ATTRACTION: ");
                                    // $scope.filteredAttraction = response.data[0];
                                    $scope.filteredAttractionList.push(response.data[0]);
                                    // console.log(response.data[0]);

                                    $scope.mergeList();
                                    $scope.processListByDate();
                                });
                        }
                    })
                });

            $rootScope.planIDFromHome = undefined;
        } else if ($scope.planSelected != undefined) {
            $scope.dataLoading = true;
            $scope.accordionDetails = true;
            $scope.bannerPlan = true;
            $scope.requestReviewText = "Review Not Requested";
            $scope.reviewRequested = false;
            console.log("plan selected manually")
            $http.get("../api/planReview/getPlanReview.php", {
                params: { planToReviewID: $scope.planSelected.planID }
            })
                .then(function (response) {
                    if (response.data[0].status === "REQUESTED" && response.data[0].valid === "TRUE") {
                        $scope.requestReviewText = "Pending Review";
                        $scope.reviewRequested = true;

                    } else if (response.data[0].status === "APPROVED" && response.data[0].valid === "TRUE") {
                        $scope.requestReviewText = "Approved";
                        $scope.reviewRequested = true;
                        $scope.reviewNotApproved = false;

                    }
                    else if (response.data[0].status === "DENIED" && response.data[0].valid === "TRUE") {
                        $scope.requestReviewText = "Denied";
                        $scope.reviewRequested = true;
                        $scope.reviewNotApproved = true;
                        // $scope.denialMessage = response.data[0].statusNotes; 
                        $scope.showDenialMessage = true;


                    }

                    console.log(response);
                    $scope.reviewObject = response.data;

                    console.log("Get customer selected from database" + $scope.clientIDSelected);
                    console.log("Customer selected 1");
                    console.log($scope.customerSelected);
                    $http.get("../api/customers/getCustomer.php", {
                        params: { customerID: $scope.clientIDSelected }
                    }).then(function (response) {
                        // console.log("Get customer selected from database" + $scope.reviewObject.clientID);
                        console.log(response.data);
                        if(response.data[0].customerID != $scope.clientIDSelected ){
                            console.log("Customer Not Match, Skipping");

                        }else{
                            $scope.customerSelected = response.data[0];
                            console.log("Customer selected 2");
                        console.log($scope.customerSelected);
                        }
                       
                    })

                });





            $http.get("../api/planEntry/getPlanEntry.php")
                .then(function (response) {
                    $scope.planEntryList = response.data;
                    $scope.userLogin = $rootScope.globals.currentUser.username;
                    $scope.planEntryList.forEach(function (item) {
                        if ($scope.planSelected.planID == item.planID) {
                            // console.log("MATCH: " + $scope.planSelected.planID + ":" + item.planID);
                            $scope.filteredPlanEntryList.push(item);
                            // $scope.filteredPlanEntryList.push(item);
                            $http.get("../api/attractions/getAttraction.php", {
                                params: { attractionID: item.attractionID }
                            })
                                .then(function (response) {
                                    // console.log("GET ATTRACTION: ");
                                    // $scope.filteredAttraction = response.data[0];
                                    $scope.filteredAttractionList.push(response.data[0]);
                                    // console.log(response.data[0]);

                                    $scope.mergeList();
                                    $scope.processListByDate();
                                });
                        }
                    })
                });
        }


    };
    $scope.filteredPlanList = [];

    $scope.updateSelectedCustomer = function () {

        if ($scope.filteredPlanList.length > 0) {
            if ($scope.filteredPlanList[0].customerID == $scope.customerSelected.customerID) {

            }

        } else {
            $scope.filteredPlanList = [];
            $http.get("../api/plans/getPlans.php")
                .then(function (response) {
                    $scope.planList = response.data;
                    $scope.planList.forEach(function (item) {
                        if ($scope.customerSelected.customerID == item.customerID) {
                            $scope.filteredPlanList.push(item);
                        }
                    })
                })
        }


    }

    $scope.refreshCustomerPlan = function () {
        $scope.filteredPlanList = [];
        $scope.processByDateList = [];

        $scope.updateSelectedCustomer();



    }
    $scope.deleteCustomerPlan = function (planIDin) {

        $ngConfirm({
            title: 'Confirm',
            content: "Are you sure you want to delete this trip plan? - ID: " + planIDin,
            type: 'red',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Delete',
                    btnClass: 'btn-red',
                    action: function () {

                        $http.post("../api/plans/deletePlan.php", { 'planID': planIDin })
                            .then(function (response) {
                                $ngConfirm(response.data);
                                $route.reload();
                            });


                    }
                },
                close: function () {
                }
            }
        });





    }
    $scope.editPlanEntry = function (size, entry, parentSelector) {
        console.log(entry);
        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/editPlanEntryModal.html',
            controller: 'editPlanEntryModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                entry: function () {
                    return entry;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deletePlanEntry = function (entryIDin) {
        $ngConfirm({
            title: 'Confirm',
            content: "Are you sure you want to delete this entry? - ID: " + entryIDin,
            type: 'red',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Delete',
                    btnClass: 'btn-red',
                    action: function () {

                        $http.post("../api/planEntry/deletePlanEntry.php", { 'entryID': entryIDin })
                            .then(function (response) {
                                $ngConfirm(response.data);
                                var indexToDelete = _.findIndex($scope.mergedFinalList, { entryID: entryIDin });
                                $scope.mergedFinalList.splice(indexToDelete, 1);
                                $scope.processListByDate();

                            });


                    }
                },
                close: function () {
                }
            }
        });

    }

    $scope.createListForCalendar = function () {
        $rootScope.calendarList = [];
        $scope.mergedFinalList.forEach(function (item) {
            var itemObject = _.extend({ id: item.entryID }, { title: item.attractionName }, { start: new Date(item.visitStart) }, { end: new Date(item.visitEnd) });
            $rootScope.calendarList.push(itemObject);

        });
        $rootScope.mergedFinalList = $scope.mergedFinalList;


        //console.log(uiCalendarConfig.calendars['planViewCalendar']);


        // console.log($scope.eventSources);


    };
    var $ctrl = this;
    $ctrl.item = ['item1', 'item2', 'item3'];

    $ctrl.animationsEnabled = true;

    $scope.openEditModal = function (size, planSelected, parentSelector) {
        console.log("open");
        console.log(planSelected);

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/editPlanModal.html',
            controller: 'editPlanModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                planSelected: function () {
                    return planSelected;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.openDestinationInfoModal = function (size, planSelected, parentSelector) {
        console.log("open");
        console.log(planSelected);

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/destinationInfoModal.html',
            controller: 'destinationInfoModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                planSelected: function () {
                    return planSelected;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.openSendEmailModal = function (size, planSelected, customerSelected, parentSelector) {
        console.log("open");
        console.log(planSelected);
        console.log(customerSelected);
        console.log($rootScope);

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: $ctrl.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../view/modal/sendEmailModal.html',
            controller: 'sendEmailModalCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                planSelected: function () {
                    return planSelected;
                },
                customerSelected: function () {
                    return customerSelected;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $ctrl.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.autoLoadPlan = function () {
        console.log("autoLoadPlan");
        console.log($rootScope.planIDFromHome);

        console.log($scope);
        $scope.getSelectedPlanEntries();

    }
    $scope.autoLoadPlan();



});

