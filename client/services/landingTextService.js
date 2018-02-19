var landingTextService = angular.module('landingTextService', []);

landingTextService.factory('landingTextService', function($q, $http){
    return{
        addOrUpdateLandingText: addOrUpdateLandingText,
        getLandingText: getLandingText
    }
    function addOrUpdateLandingText(place, text, lan){
        var d = $q.defer();
        $http.post('food/landingText/add', {place:place, text:text, lan:lan})
        .then(function(response){
            var data = response.data;
            d.resolve(data);
        }).catch(function(response){
            var err = response.data;
            d.reject(err);
        })
        return d.promise;
    }
    function getLandingText(place, lan){
        var d = $q.defer(); //$q is a promise. Means the program can keep on working and once q has the variable it will finish the designated route
        $http.post('food/landingText/get', {place:place, lan:lan})
        .then(function(response){
            var data = response.data;
            d.resolve(data);
        }).catch(function(response){
            var err = response.data;
            d.reject(err);
        })
        return d.promise;
    }
})
