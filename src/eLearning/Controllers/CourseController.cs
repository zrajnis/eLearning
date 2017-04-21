using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using eLearning.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.IO;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace eLearning.Controllers
{
    public class CourseController : Controller
    {
        private eLearningContext db;
        private UserManager<User> _userManager;

        public CourseController(UserManager<User> userManager, eLearningContext context)
        {
            _userManager = userManager;
            db = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet, Authorize, Route("/Course/Create")]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost, Authorize, Route("/Course/Create")]
        public async Task<IActionResult> Create([FromForm]CreateCourseModel cm)
        {
            var owner = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
            var newCourse = new Course { Name = cm.Name, Description = cm.Description, Owner = owner.UserName };

            bool isValid = validateCreateCourseModel(cm, owner);

            if (!isValid)
            {
                return Json(new { message = "Course creation failed!" });
            }

            db.Courses.Add(newCourse);
            db.SaveChanges();

            var courseId = newCourse.CourseId;
            int index = 0; //used for iterating through files

            foreach (string lesson in cm.Lessons)
            {
                var resourceId = 0;

                using (var stream = new FileStream("./App_Data/Resources/" + newCourse.CourseId + "-" + index + ".pdf", FileMode.Create))
                {
                    await cm.Files[index].CopyToAsync(stream);
                    var newResource = new Resource();
                    {
                        newResource.Path = "./App_Data/Resources/" + newCourse.CourseId + "-" + index + ".pdf";
                        newResource.Name = cm.Files[index].FileName;
                    }

                    db.Resources.Add(newResource);
                    db.SaveChanges();
                    index++;
                    resourceId = newResource.ResourceId;
                }

                JObject parsedObject = JObject.Parse(lesson);
                var newLesson = new Lesson
                {
                    Name = parsedObject.GetValue("Name").ToString(),
                    Description = parsedObject.GetValue("Description").ToString(),
                    CourseId = courseId,
                    ResourceId = resourceId
                };

                db.Lessons.Add(newLesson);
                db.SaveChanges();
            }

            if(cm.Exercises != null)
            {
                foreach (string exercise in cm.Exercises)
                {
                    JObject parsedObject = JObject.Parse(exercise);
                    var newExercise = new Exercise
                    {
                        Name = parsedObject.GetValue("Name").ToString(),
                        Description = parsedObject.GetValue("Description").ToString(),
                        CourseId = courseId
                    };

                    db.Exercises.Add(newExercise);
                    db.SaveChanges();

                    var exerciseId = newExercise.ExerciseId;

                    foreach (JObject question in parsedObject.GetValue("Questions"))
                    {
                        var newQuestion = new Question
                        {
                            Sentence = question.GetValue("Sentence").ToString(),
                            Points = float.Parse(question.GetValue("Points").ToString()),
                            ExerciseId = exerciseId
                        };

                        db.Questions.Add(newQuestion);
                        db.SaveChanges();

                        var questionId = newQuestion.QuestionId;

                        foreach (JObject answer in question.GetValue("Answers"))
                        {
                            var newAnswer = new Answer
                            {
                                Sentence = answer.GetValue("Sentence").ToString(),
                                IsCorrect = Convert.ToBoolean(answer.GetValue("IsCorrect").ToString()),
                                QuestionId = questionId
                            };

                            db.Answers.Add(newAnswer);
                            db.SaveChanges();
                        }
                    }
                }
            }
            return Json(new { message = "Success!" });
        }

        private bool validateCreateCourseModel(CreateCourseModel cm, User owner)
        {
            var newCourse = new Course { Name = cm.Name, Description = cm.Description, Owner = owner.UserName };

            if (!TryValidateModel(newCourse))
            {
                return false;
            }

            int fakeId = 0;
            int index = 0; //used for iterating through files

            try
            {
                var a = cm.Lessons.Count();
                if(cm.Lessons.Count() > 10)
                {
                    return false;
                }

                foreach (string lesson in cm.Lessons)
                {
                    var newResource = new Resource();
                    {
                        newResource.Path = "./ App_Data / Resources / " + newCourse.CourseId + " - " + index + ".pdf";
                        newResource.Name = cm.Files[index].FileName;
                    }

                    if (!TryValidateModel(newResource))
                    {
                        return false;
                    }

                    index++;

                    JObject parsedObject = JObject.Parse(lesson);
                    var newLesson = new Lesson
                    {
                        Name = parsedObject.GetValue("Name").ToString(),
                        Description = parsedObject.GetValue("Description").ToString(),
                        CourseId = fakeId,
                        ResourceId = fakeId
                    };

                    if (!TryValidateModel(newLesson))
                    {
                        return false;
                    }
                }

                if (cm.Exercises != null) // excercises can be null and valid since they're optional
                {
                    if(cm.Exercises.Count() > 10)
                    {
                        return false;
                    }

                    foreach (string exercise in cm.Exercises)
                    {
                        JObject parsedObject = JObject.Parse(exercise);
                        var newExercise = new Exercise
                        {
                            Name = parsedObject.GetValue("Name").ToString(),
                            Description = parsedObject.GetValue("Description").ToString(),
                            CourseId = fakeId
                        };

                        if (!TryValidateModel(newExercise))
                        {
                            return false;
                        }

                        if(parsedObject.GetValue("Questions").Count() == 0 || parsedObject.GetValue("Questions").Count() > 100)
                        {
                            return false;
                        }

                        foreach (JObject question in parsedObject.GetValue("Questions"))
                        {
                            var newQuestion = new Question
                            {
                                Sentence = question.GetValue("Sentence").ToString(),
                                Points = float.Parse(question.GetValue("Points").ToString()),
                                ExerciseId = fakeId
                            };

                            if (!TryValidateModel(newQuestion))
                            {
                                return false;
                            }

                            if (question.GetValue("Answers").Count() < 2 || question.GetValue("Answers").Count() > 5)
                            {
                                return false;
                            }

                            foreach (JObject answer in question.GetValue("Answers"))
                            {
                                var newAnswer = new Answer
                                {
                                    Sentence = answer.GetValue("Sentence").ToString(),
                                    IsCorrect = Convert.ToBoolean(answer.GetValue("IsCorrect").ToString()),
                                    QuestionId = fakeId
                                };

                                if (!TryValidateModel(newAnswer))
                                {
                                    return false;
                                };
                            }
                        }
                    }
                }
                
            }
            catch(Exception)
            {
                return false;
            }
            
            return true;
        }
    }
}
