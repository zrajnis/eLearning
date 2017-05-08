angular.module('eLearning').service('validateService', ['constants', function (constants) {
    this.touchOnSubmit = formName => {
        angular.forEach(formName.$error, (field) => {
            angular.forEach(field, (errorField) => {
                if (!errorField.$name.includes('Form')) {
                    errorField.$setTouched();
                }
                else { //if error field has "Form" in its name, then it's ng-form, so we call the same function in order to touch its fields
                    this.touchOnSubmit(errorField);
                }
            });
        });
    };

    this.resetValidity = formName => {
        formName.$setUntouched();
    };

    this.errorMsg = (inputID, message) => {
        $('#' + inputID + 'Error').text(message);
        $('#' + inputID).addClass('hasError');
        return true;
    };

    this.removeErrorMsg = inputID => {
        $('#' + inputID + 'Error').text('');
        $('#' + inputID).removeClass('hasError');
        return false;
    };
}]);