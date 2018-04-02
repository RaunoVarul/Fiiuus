var bookingAdminCtrl = angular.module('bookingAdminCtrl', []);

bookingAdminCtrl.controller('bookingAdminCtrl', function($scope, bookingService){
    $scope.pageSize=20; // number of lines in a page
    $scope.currentPage= 1; // starting page for  bron
    $scope.maxSize=9; // How many page numbers is shown
    $scope.closedPageSize=15; // these are same data as above just for closedTimes in bottom
    $scope.closedCurrentPage=1;
    $scope.closedMaxSize=5;



    $scope.sortData = function (column) {
        $scope.reverseSort = ($scope.sortColumn == column) ? !$scope.reverseSort : false;
        $scope.sortColumn = column;
    }

    $scope.getSortClass = function (column) {

        if ($scope.sortColumn == column) {
            return $scope.reverseSort
                ? 'sorting-arrow-down'
                : 'sorting-arrow-up';
        }

        return '';
    }



    $scope.form = {
        showStartTime: false,
        showEndTime: false
    }
    $scope.startTimes = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30","15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30","20:00", "20:30", "21:00", "21:30"];
    $scope.startTime = $scope.startTimes[0];

    $scope.endTimes = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30","15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30","20:00", "20:30", "21:00", "21:30"];
    $scope.endTime = $scope.endTimes[0];

    $scope.showStartTime = function(){
        $scope.form.showStartTime = true;
    }
    $scope.changeStartTime = function(item){
        $scope.startTime = item;
        $scope.form.showStartTime = false;
    }
    $scope.showEndTime = function(){
        $scope.form.showEndTime = true;
    }
    $scope.changeEndTime = function(item){
        $scope.endTime = item;
        $scope.form.showEndTime = false;
    }
    bookingService.getClosedTimes().then(function(data){
        $scope.closedTimes = data;
    })

    bookingService.getBookings().then(function(data){
        for(var i = 0; i<data.length;i++) {
            var date = data[i]['date'].split(" ")[0];
            var time = data[i]['date'].split(" ")[1];
            var datetime = new Date(date.split("-")[2], parseInt(date.split("-")[1])-1, date.split("-")[0],time.split(":")[0], time.split(":")[1]);
            data[i]['date'] = datetime;
        }
        $scope.bookings = data;
    })
    $scope.showModal = function(){
        $scope.closeTimeModal = true;
    }
    $scope.hideModal = function(){
        $scope.closeTimeModal = false;
    }
    $scope.removeBooking = function(id){
        bookingService.deleteBooking(id).then(function(data){
            bookingService.getBookings().then(function(data){
                $scope.bookings = data;
            })
        })
    }
    $scope.deleteClosedTime = function(id){
        bookingService.deleteTime(id).then(function(data){
            bookingService.getClosedTimes().then(function(data){
                $scope.closedTimes = data;
            })
        })
    }
    $scope.submitClosedTime = function(){
        var date = new Date();
        var offset = date.getTimezoneOffset() / 60;
        var officialdate = new Date(parseInt($scope.event.date.split("-")[2]), parseInt($scope.event.date.split("-")[1])-1, parseInt($scope.event.date.split("-")[0]),12);
        bookingService.addClosedTime(officialdate, (parseInt($scope.startTime.split(":")[0])+offset).toString() + ":" + $scope.startTime.split(":")[1] + ":00",
            (parseInt($scope.endTime.split(":")[0])+offset).toString() + ":"+$scope.endTime.split(":")[1] + ":00", $scope.event.reason)
            .then(function(data){
                bookingService.getClosedTimes().then(function(data){
                    $scope.closedTimes = data;
                })
            })
    }

})
