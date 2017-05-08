angular.module('eLearning').service('courseService', ['$rootScope', 'constants', 'validateService', '$http', '$timeout', '$window', function ($rootScope, constants, validateService, $http ,$timeout, $window) { 
    const pageNameArray = window.location.href.split('/'); //check if page url is course/read
    const action = pageNameArray[pageNameArray.length - 1];

    if (action.toLowerCase().includes('view')) {
        const id = action.split('=')[1]; //action will be action name + query string i.e. view?id=2 or update?id=2

        $http({
            method: "GET",
            url: "/Course/Get?id=" + id
        }).then(response => {
            if (response.data.message) {
                window.location.href = '/Course';
                return;
            }
            
            this.course = response.data;
            approximateSubs(this.course);
            this.hideSpinner = true;
        });
    }
    else if (action.toLowerCase().includes('update')) {
        const id = action.split('=')[1]; //action will be action name + query string i.e. view?id=2 or update?id=2

        $http({
            method: "GET",
            url: "/Course/Load?id=" + id
        }).then(response => {
            if (response.data.message) {
                window.location.href = '/Course';
                return;
            }

            this.course = response.data.course[0];
            this.originalCourse = this.course;
            this.removed = {
                lessonIds: [],
                exerciseIds: [],
                questionIds: [],
                answerIds: []
            };
            this.originalResource = this.resource;
            approximateSubs(this.course);
            this.hideSpinner = true;
        });
    }
    else if (action.toLowerCase().includes('search')) {
        const name = action.split('=')[1]; //action will be action name + query string i.e. view?id=2 or update?id=2

        $http({
            method: "GET",
            url: "/Course/Find?name=" + name
        }).then(response => {
            if (response.data.message) {
                window.location.href = '/Course';
                return;
            }
            this.searchResults = response.data.searchResults;
            this.searchResults.forEach((result, index) => approximateSubs(this.searchResults[index]));
            this.hideSpinner = true;
        });
    }
    else if (action.toLowerCase().includes('exercise')) {
        const id = action.split('=')[1]; //action will be action name + query string i.e. view?id=2 or update?id=2

        $http({
            method: "GET",
            url: "/Exercise/Load?id=" + id
        }).then(response => {
            if (response.data.message) {
                window.location.href = '/Error';
                return;
            }

            this.loadedExercise = response.data.exercise[0];
            this.exerciseAnswers = [];
            resetExerciseData();
            this.hideSpinner = true;
        });     
    }

    $('#createForm').on('keyup keypress', function (e) { //disable submit when enter is pressed
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

    this.course = {
        name: null,
        description: null,
        lessons: [],
        exercises: []
    };

    this.search = () => {
        window.location.href = '/Course/Search?name=' + this.searchInput;
    };

    this.subscribe = () => {
        $('#subscribeBtn').addClass('unclickable'); //prevent request spamming
        $http.post("/Course/Subscribe", this.course.id).then(response => {
            if (response.data.message === 'Success!') {
                const newCourse = {
                    name: this.course.name,
                    id: this.course.id
                };

                this.course.subscriberCount++;
                this.course.isSubscribed = true;
                approximateSubs(this.course);
                $rootScope.$broadcast('subscribe', newCourse);
            }
            else {
                this.course.subscribeError = true;
                $timeout(() => this.course.subscribeError = false, 2000);
            }

            $('#subscribeBtn').removeClass('unclickable');
        });
    };

    this.unsubscribe = () => {
        $('#subscribeBtn').addClass('unclickable'); //prevent request spamming
        $http.post("/Course/Unsubscribe", this.course.id).then(response => {
            if (response.data.message === 'Success!') {
                this.course.subscriberCount--;
                this.course.isSubscribed = false;
                approximateSubs(this.course);
                $rootScope.$broadcast('unsubscribe', this.course.id);
            }
            else {
                this.course.unsubscribeError = true;
                $timeout(() => this.course.unsubscribeError = false, 2000);
            }

            $('#subscribeBtn').removeClass('unclickable');
        });
    };

    this.loadResource = id => {
        this.resourceAddress = "http://localhost:55416/Resource/Load/?id=" + id; //load pdf in iframe
        $('#resourceDisplayModal').modal('show');
    };

    this.loadExercise = id => {
        this.resourceAddress = "http://localhost:55416/Exercise?id=" + id; //load exercise in iframe
        $('#resourceDisplayModal').modal('show');
    };

    this.addLesson = formName => {
        if (formName.lessonsLength.$modelValue < 10) {
            formName.lessonsLength.$setTouched(true);
            this.course.lessons.push({
                name: null,
                description: null
            });
            $timeout(() => scrollBottom('lessonsFieldsetElements'), 1);
        }
        else { //if user already created 10 lessons and tried to add another one,show error 
            formName.lessonsLength.$setTouched(true);
            formName.lessonsLength.$setValidity('pattern', false);
            $timeout(() => formName.lessonsLength.$setValidity('pattern', true), 2000);
        }
    };

    this.addExercise = formName => {
        if (formName.exercisesLength.$valid && formName.exercisesLength.$modelValue < 10) {
            this.course.exercises.push({
                name: null,
                description: null,
                questions: []
            });
            $timeout(() => scrollBottom('exercisesFieldsetElements'), 1);
        }
        else {
            formName.exercisesLength.$setTouched(true);
            formName.exercisesLength.$setValidity('pattern', false);
            $timeout(() => formName.exercisesLength.$setValidity('pattern', true), 2000);
        }

    };

    this.addQuestion = (formName, exerciseIndex) => {
        const questionsLength = formName['questionsLength' + exerciseIndex];

        if (questionsLength.$modelValue < 100) {
            this.course.exercises[exerciseIndex].questions.push({
                sentence: null,
                points: null,
                answers: []
            });
            $timeout(() => scrollToQuestion('addQuestionBtn' + exerciseIndex), 1);
        }
        else { //for consistency 
            questionsLength.$setTouched(true);
            questionsLength.$setValidity('pattern', false);
            $timeout(() => questionsLength.$setValidity('pattern', true), 2000);
        }
        
    };

    this.addAnswer = (formName, exercise, questionIndex) => {
        let answer = formName['answer' + questionIndex];
        const answersLength = formName['answersLength' + questionIndex];
        const exerciseIndex = this.course.exercises.indexOf(exercise);

        if (answersLength.$modelValue < 5 && answer.$valid && answer.$modelValue) { //answer field isnt required, so empty field passes as valid, hence last condition
            this.course.exercises[exerciseIndex].questions[questionIndex].answers.push({
                sentence: this.course.exercises[exerciseIndex].questions[questionIndex].answer,
                isCorrect: false
            });
            this.course.exercises[exerciseIndex].questions[questionIndex].answer = ''; //reset field value
            $timeout(() => scrollToAnswer('questionContainerE' + exerciseIndex + 'Q' + questionIndex), 1);
        }
        else if (!answer.$valid || !answer.$modelValue) {
            answer.$setValidity('pattern', false);
            if (answer.$pristine) {
                answer.$setTouched(true); //in case user didn't even click on the input, this makes sure it shows error as well
            }

            $timeout(() => answer.$setValidity('pattern', true), 2000);  
        }
        else {
            answersLength.$setTouched(true);
            answersLength.$setValidity('pattern', false);
            $timeout(() => answersLength.$setValidity('pattern', true), 2000);
        }
    };

    this.createCourse = formName => {
        if (!formName.$valid) {
            validateService.touchOnSubmit(formName);
            return;
        }

        let fd = new FormData();

        $.each($("input[type='file']"), (i, input) => { //append each uploaded file to the form data
            fd.append('Files', input.files[0]);
        });

        fd.append('Name', this.course.name);
        fd.append('Description', this.course.description);

        for (let i = 0; i < this.course.lessons.length; i++) {
            fd.append('Lessons[]', JSON.stringify(this.course.lessons[i]));
        }

        for (let i = 0; i < this.course.exercises.length; i++) {
            fd.append('Exercises[]', JSON.stringify(this.course.exercises[i]));
        }

        $http.post('/Course/Create', fd, {
            //transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(response => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/Course/Create';
                return;
            }

            $('#createError').text(response.data.message);
            $timeout(() => {
                $('#createError').text('');
            }, 2000);
        });
    };

    this.remove = (array, index) => {
        array.splice(index, 1);
    };

    this.removeAndRemember = (array, index, type) => {
        if (array[index]['id'] !== undefined) {
            this.removed[type + 'Ids'].push(array[index]['id']);
        }

        this.remove(array, index);
    };

    this.updateCourse = formName => {
        
        if (!formName.$valid) {
            validateService.touchOnSubmit(formName);
            return;
        }

        let fd = new FormData();

        $.each($("input[type='file']"), (i, input) => { //append each uploaded file to the form data
            fd.append('Files', input.files[0]);
        });

        fd.append('Id', this.course.id);
        fd.append('Name', this.course.name);
        fd.append('Description', this.course.description);

        for (let i = 0; i < this.course.lessons.length; i++) {
            fd.append('Lessons[]', JSON.stringify(this.course.lessons[i]));
        }

        for (let i = 0; i < this.course.exercises.length; i++) {
            fd.append('Exercises[]', JSON.stringify(this.course.exercises[i]));
        }
        fd.append('Removed', JSON.stringify(this.removed));

        $http.post('/Course/Update', fd, {
            headers: { 'Content-Type': undefined }
        }).then(response => {
            if (response.data.message === 'Success!') {
                $window.location.href = '/';
                return;
            }

            $('#updateError').text(response.data.message);
            $timeout(() => {
                $('#updateError').text('');
            }, 2000);
        });
    };

    this.deleteCourse = () => {
        $http({
            method: "DELETE",
            url: "/Course/Delete?id=" + this.course.id,
            headers: {
                'Accept': 'application/vnd.hal+json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.data.message === 'Success!') {
                window.location.href = '/Course';
                return;
            }

            $('#deleteError').text(response.data.message);
            $timeout(() => {
                $('#deleteError').text('');
            }, 2000);
        });
    };

    this.checkMyCourse = (courseId, myCourses) => {
        if (myCourses && myCourses.length > 0) {
            for (let i = 0; i < myCourses.length; i++) {
                if (courseId === myCourses[i].id) {
                    return true;
                }
            }
        }
        return false;
    };

    const scrollBottom = id => {
        const el = $('#' + id);

        el.scrollTop(el.prop('scrollHeight'));
    };

    const scrollToQuestion = (id, exerciseId) => {
        const el = $('#' + id);
        const fieldsetContainer = $('#exercisesFieldsetElements');

        fieldsetContainer.scrollTop(el.position().top - 400);
    };

    const scrollToAnswer = (id) => {
        const questionContainer = $('#' + id);
        const fieldsetContainer = $('#exercisesFieldsetElements');

        fieldsetContainer.scrollTop(questionContainer.position().top + 75);
    };

    const approximateSubs = obj => {
        const numOfDigits = obj.subscriberCount.toString().length;

        if (numOfDigits >= 4 && numOfDigits < 7) {
            obj.approxSubCount = parseInt(obj.subscriberCount / 1000) + 'K';
        }
        else if (numOfDigits >= 7 && numOfDigits < 10) {
            obj.approxSubCount = parseInt(obj.subscriberCount / 1000000) + 'M';
        }
        else if(numOfDigits >= 10) {
            obj.approxSubCount = parseInt(obj.subscriberCount / 1000000000) + 'B';
        }
        else {
            obj.approxSubCount = obj.subscriberCount;
        }
    };

    this.calculateScore = () => {
        let totalPoints = 0;
        this.loadedExercise.questions.forEach((question) => {
            totalPoints +=  question.points;
        });
        let achievedPoints = 0;
        this.loadedExercise.questions.forEach((question, questionIndex) => {
            let correctAnswerCnt = 0;

            question.answers.forEach((answer, answerIndex) => {
                correctAnswerCnt = answer.isCorrect ? ++correctAnswerCnt : correctAnswerCnt;
            });

            let emptyAnswerCnt = 0;
            let answerMultiplier = 0;

            question.answers.forEach((answer, answerIndex) => {
                if (answer.isCorrect && this.exerciseAnswers[questionIndex][answerIndex] && correctAnswerCnt) {
                    answerMultiplier += 1 / correctAnswerCnt;
                }
                else if (answer.isCorrect && !this.exerciseAnswers[questionIndex][answerIndex] && correctAnswerCnt ||
                    !answer.isCorrect && this.exerciseAnswers[questionIndex][answerIndex] && correctAnswerCnt ||
                    !correctAnswerCnt && this.exerciseAnswers[questionIndex][answerIndex]) {
                    answerMultiplier -= 1 / correctAnswerCnt;
                }
                else if (!answer.isCorrect && !this.exerciseAnswers[questionIndex][answerIndex] && correctAnswerCnt === 0) {
                    emptyAnswerCnt++;
                }
            });
            if (correctAnswerCnt === 0) { //in case there was a trick question with no checked answers
                achievedPoints += emptyAnswerCnt === question.answers.length ? question.points : 0;
            }
            else {
                answerMultiplier = answerMultiplier < 0 ? 0 : answerMultiplier;
                achievedPoints += question.points * answerMultiplier;
            }           
        });

        const score = (achievedPoints / totalPoints * 100).toFixed(2);

        $http({
            method: "POST",
            url: "/Exercise/Result",
            headers: {
                'Accept': 'application/vnd.hal+json',
                'Content-Type': 'application/json'
            },
            data: {
                Score: score,
                Id: this.loadedExercise.id
            }
        }).then(response => {
            if (response.data.message === 'Success!') {
                resetExerciseData();
                window.parent.updateScore(score, this.loadedExercise.id);
                window.parent.closeModal();
                return;
            }

            $('#deleteError').text(response.data.message);
            $timeout(() => {
                $('#deleteError').text('');
            }, 2000);
        });
    };

    window.closeModal = () => {
        $('#resourceDisplayModal').modal('hide');
    };

    window.updateScore = (score, id) => {
        this.course.exercises.forEach(exercise => {
            if (exercise.id === id) {
                exercise.score = score;
                $rootScope.$broadcast('updateScore');
            }
        })
    };
    const resetExerciseData = () => {
        this.loadedExercise.questions.forEach((question, questionIndex) => {
            this.exerciseAnswers[questionIndex] = [];
            question.answers.forEach((answer, answerIndex) => {
                this.exerciseAnswers[questionIndex][answerIndex] = false;
            });
        });
    };
}]);