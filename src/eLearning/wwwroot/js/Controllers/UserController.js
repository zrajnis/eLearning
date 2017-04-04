angular.module('eLearning').controller('UserCtrl', ['$scope', '$http', '$window', 'validateService', 'cleanUpService', 'constants', ($scope, $http, $window, validateService, cleanUpService, constants) => {
    $scope.signOut = () => {
        $http({
            method: "POST",
            url: "/Account/SignOut",
        }).then((response) => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/';
            }
            else {
                alert(JSON.stringify(response.data.message)); //pretty much impossible scenario
            }
        });
    }

    $scope.settingsValidateField = (fieldName) => validateService.settingsValidateField(fieldName, $scope);
}]);