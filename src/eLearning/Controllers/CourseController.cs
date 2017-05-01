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
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.EntityFrameworkCore.Internal;

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

        [Route("/Course")]
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        [HttpGet("Course/View/{id}"), Route("/Course/View")]
        public IActionResult Read(int id)
        {
            return View();
        }

        [HttpGet("Course/Search/{name}"), Route("/Course/Search")]
        public IActionResult Search(string name)
        {
            return View();
        }


        [HttpGet("Course/Load/{id}"), Route("/Course/Load")]
        public IActionResult Load(int id)
        {
            var courseExists = db.Courses.Any(c => c.Id == id);

            if (!courseExists)
            {
                return Json(new { message = "No course found!" });
            }

            var readCourse = db.Courses.FirstOrDefault(c => c.Id == id);
            var readLessons = db.Lessons.Where(l => l.CourseId == readCourse.Id).Select(l=> new { l.Id, l.Name, l.Description, l.ResourceId});
            var subscriberCount = db.Subscriptions.Count(s => s.CourseId == readCourse.Id);

            if (!User.Identity.IsAuthenticated)
            {
                return Json(new
                {
                    id = readCourse.Id,
                    name = readCourse.Name,
                    description = readCourse.Description,
                    lessons = readLessons,
                    canSubscribe = false,
                    subscriberCount = subscriberCount
                });
            }

            var user = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
            var readExercises = db.Exercises.Where(e => e.CourseId == readCourse.Id).Select(e => new { e.Id, e.Name, e.Description });
            var isSubscribed = db.Subscriptions.Any(s => s.CourseId == readCourse.Id && s.UserId == user.Id);

            return Json(new {
                id = readCourse.Id,
                name = readCourse.Name,
                description = readCourse.Description,
                lessons = readLessons,
                exercises = readExercises,
                canSubscribe = true, //used to check if user is logged when deciding whether to display subscribe button
                isSubscribed = isSubscribed,
                subscriberCount = subscriberCount});
        }

        [HttpGet("Course/Find/{name}"), Route("/Course/Find")]
        public IActionResult Find(string name)
        {
            var searchResults = (from c in db.Courses
                                 where c.Name.Contains(name)
                                 let subscriberCount = (from s in db.Subscriptions where c.Id == s.CourseId select s).Count()
                                 orderby subscriberCount descending
                                 select new
                                 {
                                     name = c.Name,
                                     description = c.Description,
                                     id = c.Id,
                                     subscriberCount = subscriberCount
                                 }).ToList();

            return Json(new { searchResults = searchResults });
        }

        [HttpPost, Authorize]
        public IActionResult Subscribe([FromBody]int id)
        {
            var user = db.Users.First(u => u.UserName == User.Identity.Name);
            var isSubscribed = db.Subscriptions.Any(s => s.UserId == user.Id && s.CourseId == id);

            if (!isSubscribed)
            {
                Subscription newSubscription = new Subscription
                {
                    UserId = user.Id,
                    CourseId = id
                };

                db.Subscriptions.Add(newSubscription);
                db.SaveChanges();
                return Json(new { message = "Success!" });
            }

            return Json(new { message = "Already subscribed." });
        }

        [HttpPost, Authorize]
        public IActionResult Unsubscribe([FromBody]int id)
        {
            var user = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
            var isSubscribed = db.Subscriptions.Any(s => s.UserId == user.Id && s.CourseId == id);

            if (isSubscribed)
            {
                var removeSubscription = db.Subscriptions.First(s => s.UserId == user.Id && s.CourseId == id);

                db.Subscriptions.Remove(removeSubscription);
                db.SaveChanges();
                return Json(new { message = "Success!" });
            }

            return Json(new { message = "Already unsubscribed." });
        }


        [HttpGet("Resource/Load/{id}"), Route("/Resource/Load")]
        public IActionResult LoadResource(int id)
        {
            var appPath = PlatformServices.Default.Application.ApplicationBasePath;
            var resourceExists = db.Resources.Any(r => r.Id == id);

            appPath = appPath.Remove(appPath.Length - 24); //base path shows path to debug, we cut off unnecessary part so it points to project
            if (resourceExists)
            {
                var loadResource = db.Resources.FirstOrDefault(r => r.Id == id);
                return PhysicalFile(appPath + loadResource.Path, "application/pdf");
            }
            return Json(new { error = "Resource not found." });
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

            var courseId = newCourse.Id;
            int index = 0; //used for iterating through files

            foreach (string lesson in cm.Lessons)
            {
                var resourceId = 0;

                using (var stream = new FileStream("./App_Data/Resources/" + newCourse.Id + "-" + index + ".pdf", FileMode.Create))
                {
                    await cm.Files[index].CopyToAsync(stream);
                    var newResource = new Resource();
                    {
                        newResource.Path = "./App_Data/Resources/" + newCourse.Id + "-" + index + ".pdf";
                        newResource.Name = cm.Files[index].FileName;
                    }

                    db.Resources.Add(newResource);
                    db.SaveChanges();
                    index++;
                    resourceId = newResource.Id;
                }

                JObject parsedObject = JObject.Parse(lesson);
                var newLesson = new Lesson
                {
                    Name = parsedObject.GetValue("name").ToString(),
                    Description = parsedObject.GetValue("description").ToString(),
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
                        Name = parsedObject.GetValue("name").ToString(),
                        Description = parsedObject.GetValue("description").ToString(),
                        CourseId = courseId
                    };

                    db.Exercises.Add(newExercise);
                    db.SaveChanges();

                    var exerciseId = newExercise.Id;

                    foreach (JObject question in parsedObject.GetValue("questions"))
                    {
                        var newQuestion = new Question
                        {
                            Sentence = question.GetValue("sentence").ToString(),
                            Points = float.Parse(question.GetValue("points").ToString()),
                            ExerciseId = exerciseId
                        };

                        db.Questions.Add(newQuestion);
                        db.SaveChanges();

                        var questionId = newQuestion.Id;

                        foreach (JObject answer in question.GetValue("answers"))
                        {
                            var newAnswer = new Answer
                            {
                                Sentence = answer.GetValue("sentence").ToString(),
                                IsCorrect = Convert.ToBoolean(answer.GetValue("isCorrect").ToString()),
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
                        newResource.Path = "./ App_Data / Resources / " + fakeId + " - " + index + ".pdf";
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
                        Name = parsedObject.GetValue("name").ToString(),
                        Description = parsedObject.GetValue("description").ToString(),
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
                            Name = parsedObject.GetValue("name").ToString(),
                            Description = parsedObject.GetValue("description").ToString(),
                            CourseId = fakeId
                        };

                        if (!TryValidateModel(newExercise))
                        {
                            return false;
                        }

                        if(parsedObject.GetValue("questions").Count() == 0 || parsedObject.GetValue("questions").Count() > 100)
                        {
                            return false;
                        }

                        foreach (JObject question in parsedObject.GetValue("questions"))
                        {
                            var newQuestion = new Question
                            {
                                Sentence = question.GetValue("sentence").ToString(),
                                Points = float.Parse(question.GetValue("points").ToString()),
                                ExerciseId = fakeId
                            };

                            if (!TryValidateModel(newQuestion))
                            {
                                return false;
                            }

                            if (question.GetValue("answers").Count() < 2 || question.GetValue("answers").Count() > 5)
                            {
                                return false;
                            }

                            foreach (JObject answer in question.GetValue("answers"))
                            {
                                var newAnswer = new Answer
                                {
                                    Sentence = answer.GetValue("sentence").ToString(),
                                    IsCorrect = Convert.ToBoolean(answer.GetValue("isCorrect").ToString()),
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
