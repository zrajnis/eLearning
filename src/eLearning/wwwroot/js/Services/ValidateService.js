angular.module('eLearning').service('validateService', ['constants', function (constants) {
    this.errorMsg = (errorName, message) => {
        $('#' + errorName + 'Error').text(message);
        $('#' + errorName).addClass('hasError');
        return true;
    };

    this.removeErrorMsg = (errorName) => {
        $('#' + errorName + 'Error').text('');
        $('#' + errorName).removeClass('hasError');
    };

    this.signUpValidate = ($scope) => {
        if (!constants.firstNameRegex.test($scope.signUpFirstName) || !$scope.signUpFirstName) { //alternative is pre writing all errors, hiding them and then showing ones that do come up
            $scope.errorExists = this.errorMsg('signUpFirstName', constants.firstNameError);
        }

        if (!constants.lastNameRegex.test($scope.signUpLastName) || !$scope.signUpLastName) {
            $scope.errorExists = this.errorMsg('signUpLastName', constants.lastNameError);
        }

        if (!constants.emailRegex.test($scope.signUpEmail) || !$scope.signUpEmail) { // or statement isnt needed for this case ,but still ,consistency
            $scope.errorExists = this.errorMsg('signUpEmail', constants.emailError);
        }

        if (!constants.passwordRegex.test($scope.signUpPassword) || !$scope.signUpPassword) {
            $scope.errorExists = this.errorMsg('signUpPassword', constants.passwordError);
        }

        if ($scope.signUpPassword !== $scope.signUpRePassword || !$scope.signUpRePassword) {
            $scope.errorExists = this.errorMsg('signUpRePassword', constants.rePasswordError);
        }
    };

    this.signUpValidateField = (fieldID, $scope) => { //is invoked dynamically on input change
        const fieldName = fieldID.substr(6, 1).toLowerCase() + fieldID.substr(7, fieldID.length - 7); // convert field's id to fields name i.e. signUpFirstName -> firstName

        if (fieldID !== 'signUpRePassword' && !constants[fieldName + 'Regex'].test($scope[fieldID])) {
            $scope.errorExists = this.errorMsg(fieldID, constants[fieldName + 'Error']);
        }
        else if (fieldID === 'signUpRePassword' && ($scope.signUpPassword !== $scope.signUpRePassword || !$scope.signUpRePassword)) { //has different validation condition
            $scope.errorExists = this.errorMsg(fieldID, constants.rePasswordError)
        }
        else {
            this.removeErrorMsg(fieldID);
        }
    };

    this.signInValidate = ($scope) => {
        if (!constants.emailRegex.test($scope.signInEmail) || !$scope.signInEmail) {
            $scope.errorExists = this.errorMsg('signIn', constants.signInError);
        }

        if (!constants.passwordRegex.test($scope.signInPassword) || !$scope.signInPassword) {
            $scope.errorExists = this.errorMsg('signIn', constants.signInError);
        }
    };

    this.settingsValidateField = (fieldID, $scope) => { //is invoked dynamically on input change
        const fieldName = fieldID.includes('Password') ?
                            fieldID.substr(11, 1).toLowerCase() + fieldID.substr(12, fieldID.length - 12) //cuts off 3 more letters i.e settingsOldPassword -> password
                        :
                            fieldID.substr(8, 1).toLowerCase() + fieldID.substr(9, fieldID.length - 9); // i.e settingsLastName -> lastName

        if (fieldID !== 'settingsRePassword' && !constants[fieldName + 'Regex'].test($scope[fieldID])) {
            $scope[fieldName + 'Error'] = this.errorMsg(fieldID, constants[fieldName + 'Error']);
        }
        else if (fieldID === 'settingsRePassword' && ($scope.settingsNewPassword !== $scope.settingsRePassword || !$scope.settingsRePassword)) {
            $scope['rePasswordError'] = this.errorMsg(fieldID, constants.rePasswordError);
        }
        else {
            this.removeErrorMsg(fieldID);
            fieldID === 'settingsRePassword' ? $scope['rePasswordError'] = false : $scope[fieldName + 'Error'] = false;
        }
    };

}]);