
app.controller('viewPlanCalendarCtrl', function ($scope, $http, $rootScope, $uibModal, $log, $document, $timeout, $location, $route, $compile, uiCalendarConfig, $window,$ngConfirm) {
    $scope.checked = false;
    $scope.alertMessage = "Please select a view from left to open calendar";
    $scope.entryIDList = [];
    $scope.hideCal = true;

    $scope.displayCalendar = function (view) {
        $scope.hideCal = false;
        //CALENDAR
        console.log($scope.mergedFinalList);
        var earliest = $scope.calendarList[0].start;
        $scope.calendarList.forEach(function (item) {
            if (item.start < earliest) {
                earliest = item.start;
            }
        });
        console.log("earliest date: " + earliest);
        $scope.eventSources = [$scope.calendarList];
        $scope.renderCalender('planViewCalendar');
        $scope.refreshEvents('planViewCalendar');
        if (view === 'week') {
            $scope.changeView('agendaWeek', 'planViewCalendar');


        } if (view === 'month') {
            $scope.changeView('month', 'planViewCalendar');


        }
        if (view === 'day') {
            $scope.changeView('agendaDay', 'planViewCalendar');


        }

        $scope.gotoDate(earliest, 'planViewCalendar');


        // uiCalendarConfig.calendars['planViewCalendar'].fullCalendar('render');


    };

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    /* event source that contains custom events on the scope */
    $scope.events = [
        { title: 'All Day Event', start: new Date(y, m, 1) },
        { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
        { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false, editable: true },
        { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
        { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
        { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    ];
    // console.log($scope.events);


    // $scope.calEventsExt = {
    //     color: '#f00',
    //     textColor: 'yellow',
    //     events: [
    //         { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
    //         { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
    //         { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    //     ]
    // };
    $scope.toggle = function () {
        $scope.checked = !$scope.checked
    }
    $scope.getEventDetail = function (eventEntryID) {
        console.log($scope.eventDetail);

        $scope.eventDetail = _.findWhere($scope.mergedFinalList, { entryID: eventEntryID });
        console.log($scope.eventDetail);

    }
    /*  on eventClick */
    $scope.OnEventClick = function (event, jsEvent, view) {
        console.log("clicked");
        $scope.alertMessage = ("Entry ID:" + event.id + "-" + event.title + ' was clicked ');
        $scope.checked = true;
        $scope.getEventDetail(event.id);
        //         console.log($scope.calendarList);

        // console.log(_.findIndex($scope.calendarList, {id:event.id}));


    };
    /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event ' + event.id + event.title + 'Droped to make dayDelta ' + delta + "in day " + moment.duration(delta).asHours());

        var itemToUpdate = _.extend({ entryID: event.id }, { visitStart: event.start.toISOString() }, { visitEnd: event.end.toISOString() });

        $scope.entryIDList.push(itemToUpdate);

        // console.log(currentStart.format('LLLL') +' To '+currentEnd.format('LLLL') +' is now '+newStart.toISOString() +' To '+newEnd.toISOString() +' for '+event.id+event.title);

    };
    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        var itemToUpdate = _.extend({ entryID: event.id }, { visitStart: event.start.toISOString() }, { visitEnd: event.end.toISOString() });

        $scope.entryIDList.push(itemToUpdate);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function () {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    };
    /* refresh event */
    $scope.refreshEvents = function (calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('removeEvents');
        uiCalendarConfig.calendars[calendar].fullCalendar('addEventSource', $scope.calendarList);
    }
    $scope.gotoDate = function (date, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('gotoDate', date);
    };

    /* Change View */
    $scope.changeView = function (view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function (calendar) {

        if (uiCalendarConfig.calendars[calendar]) {
            console.log("render");
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };
    /* config object */

    $scope.uiConfig = {
        calendar: {
            height: 600,
            editable: true,

            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventClick: $scope.OnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };



    //         /* event sources array*/
    //          uiCalendarConfig.calendars.myCalendar.fullCalendar('removeEvents');
    // uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', events);
    $scope.eventSources = [$scope.events];


    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];


    $scope.updatePlanEntry = function (updateType) {
        console.log("update planEntry");
        console.log($scope.entryIDList);

        $scope.entryIDList.forEach(function (item) {
            console.log(item.entryID, item.visitEnd)
            $http.post(
                "../api/planEntry/updatePlanEntry.php", {
                    'updateType': "updateTime",
                    'entryID': item.entryID,
                    'visitStart': item.visitStart,
                    'visitEnd': item.visitEnd
                }
            ).then(function (response) {
                console.log("Data Updated");
                $scope.entryIDList = [];
                $scope.alertMessage = response.data;

            });




        });
    };
    $scope.testSave = function () {
        $http.post(
            "../api/planEntry/updatePlanEntry.php", {
                'updateType': "updateTime",
                'entryID': "17",
                'visitStart': "2017-04-18T14:00:00.000Z",
                'visitEnd': "2017-04-18T15:00:00.000Z"
            }
        ).then(function (response) {
            console.log("Data Updated");

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
                action: function(){
                    $http.post("../api/planEntry/deletePlanEntry.php", { 'entryID': entryIDin })
                    .then(function (response) {
                        $ngConfirm(response.data);
                        console.log($scope.calendarList);
                        console.log(_.findIndex($scope.calendarList, { id: entryIDin }));
                        var indexToDelete = _.findIndex($scope.calendarList, { id: entryIDin });
    
                        $scope.calendarList.splice(indexToDelete, 1);
                        $scope.refreshEvents('planViewCalendar');
    
                        // $scope.mergedFinalList = _.without($scope.mergedFinalList, _.findWhere($scope.mergedFinalList, {entryID:entryIDin}));
                    });
                }
            },
            close: function () {
            }
        }
    });
       
    }

});