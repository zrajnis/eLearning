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
using Microsoft.AspNetCore.Http;

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

        [HttpGet, Authorize, Route("/Course/Create")]
        public IActionResult Create()
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

        [HttpGet("Course/View/{id}"), Authorize, Route("/Course/Update")]
        public IActionResult Update(int id)
        {
            var courseExists = db.Courses.Any(c => c.Id == id);
            if (courseExists)
            {
                var updateCourse = db.Courses.FirstOrDefault(uc => uc.Id == id);
                if (updateCourse.Owner == User.Identity.Name)
                {
                    return View();
                }
            }

            return Redirect("/Course");
        }


        [HttpGet("Course/Get/{id}"), Route("/Course/Get")]
        public IActionResult Get(int id) //gets lesson and exercise names, ids and descriptions for a course
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

        [HttpGet("Course/Load/{id}"), Route("/Course/Load")] //loads all course data for a specific course
        public IActionResult Load(int id)
        {
            var courseExists = db.Courses.Any(c => c.Id == id);

            if (!courseExists)
            {
                return Json(new { message = "No course found!" });
            }


            if (!User.Identity.IsAuthenticated)
            {
                var readCourse = (from c in db.Courses
                                      where c.Id == id
                                      let lessons = (from l in db.Lessons
                                                     where l.CourseId == id
                                                     let resource = (from r in db.Resources
                                                                     where r.Id == l.ResourceId
                                                                     select r)
                                                     select new { name = l.Name, description = l.Description, id = l.Id, resource = resource }).ToList()
                                      let subscriberCount = (from s in db.Subscriptions
                                                             where s.CourseId == id
                                                             select s).Count()
                                      select new
                                      {
                                          name = c.Name,
                                          description = c.Description,
                                          id = c.Id,
                                          lessons = lessons,
                                          subscriberCount = subscriberCount,
                                          canSubscribe = true
                                      });
            }

            var user = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
            var readUserCourse = (from c in db.Courses
                              where c.Id == id
                              let lessons = (from l in db.Lessons
                                             where l.CourseId == id
                                             let resource = (from r in db.Resources
                                                             where r.Id == l.ResourceId
                                                             select r)
                                             select new { name = l.Name, description = l.Description, id = l.Id, resource = resource }).ToList()
                              let subscriberCount = (from s in db.Subscriptions
                                                     where s.CourseId == id
                                                     select s).Count()
                              let exercises = (from e in db.Exercises
                                               where e.CourseId == id
                                               let questions = (from q in db.Questions
                                                                where q.ExerciseId == e.Id
                                                                let answers = (from a in db.Answers
                                                                               where a.QuestionId == q.Id
                                                                               select a).ToList()
                                                                select new { sentence = q.Sentence, points = q.Points, id = q.Id, answers = answers }).ToList()
                                               orderby subscriberCount descending
                                               select new
                                               {
                                                   name = e.Name,
                                                   description = e.Description,
                                                   id = e.Id,
                                                   questions = questions
                                               }).ToList()
                              let isSubscribed = (from s in db.Subscriptions
                                                  where  s.CourseId == id && s.UserId == user.Id
                                                  select s).Any()
                              select new
                              {
                                  name = c.Name,
                                  description = c.Description,
                                  id = c.Id,
                                  lessons = lessons,
                                  subscriberCount = subscriberCount,
                                  exercises = exercises,
                                  isSubscribed = isSubscribed,
                                  canSubscribe = true
                              });
            //var readExercises = db.Exercises.Where(e => e.CourseId == readCourse.Id).Select(e => new { e.Id, e.Name, e.Description });
            //var isSubscribed = db.Subscriptions.Any(s => s.CourseId == id && s.UserId == user.Id);
            return Json(new
            {
                course = readUserCourse,
            });
        }

        [HttpGet("Course/Find/{name}"), Route("/Course/Find")] //gets all courses that fit criteria
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

        [HttpPost, Authorize, Route("/Course/Update")]
        public async Task<IActionResult> Update([FromForm]UpdateCourseModel cm)
        {
            var owner = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
            var createCourseModel = new CreateCourseModel
            {
                Name = cm.Name,
                Description = cm.Description,
                Lessons = cm.Lessons,
                Exercises = cm.Exercises,
                Files = (List<IFormFile>)cm.Files
            };

            bool isValid = validateCreateCourseModel(createCourseModel, owner);

            if (!isValid)
            {
                return Json(new { message = "Course update failed!" });
            }

            var appPath = PlatformServices.Default.Application.ApplicationBasePath;
            appPath = appPath.Remove(appPath.Length - 24);

            var updateCourse = db.Courses.FirstOrDefault(c => c.Id == cm.Id);

            updateCourse.Name = cm.Name;
            updateCourse.Description = cm.Description;
            db.Courses.Update(updateCourse);
            db.SaveChanges();

            JObject toRemove = JObject.Parse(cm.Removed);
            foreach(JValue lessonId in toRemove.GetValue("lessonIds"))
            {
                int id = int.Parse(lessonId.ToString());
                var removeLesson = db.Lessons.FirstOrDefault(a => a.Id == id);
                var removeResoruce = db.Resources.FirstOrDefault(r => r.Id == removeLesson.ResourceId);
                db.Lessons.Remove(removeLesson);
                db.SaveChanges();
                db.Resources.Remove(removeResoruce);
                db.SaveChanges();
                System.IO.File.Delete(removeResoruce.Path);

            }
            foreach (JValue exerciseId in toRemove.GetValue("exerciseIds"))
            {
                int id = int.Parse(exerciseId.ToString());
                var removeExercise = db.Exercises.First(a => a.Id == id);
                db.Exercises.Remove(removeExercise);
                db.SaveChanges();
            }
            foreach (JValue questionId in toRemove.GetValue("questionIds"))
            {
                int id = int.Parse(questionId.ToString());
                var removeQuestion = db.Questions.First(a => a.Id == id);
                db.Questions.Remove(removeQuestion);
                db.SaveChanges();
            }
            foreach (JValue answerId in toRemove.GetValue("answerIds"))
            {
                int id = int.Parse(answerId.ToString());
                var removeAnswer = db.Answers.First(a => a.Id == id);
                db.Answers.Remove(removeAnswer);
                db.SaveChanges();
            }

            var courseId = updateCourse.Id;
            int index = 0; //used for iterating through files

            foreach (string lesson in cm.Lessons)
            {
                var resourceId = 0;
                var filePath = appPath + "\\App_Data\\Resources\\" + updateCourse.Id + "-" + index + ".pdf";
                if (System.IO.File.Exists(@filePath)) //delete old file
                {
                    System.IO.File.Delete(@filePath);
                    var updateResource = db.Resources.FirstOrDefault(r => r.Path == "./App_Data/Resources/" + updateCourse.Id + "-" + index + ".pdf");
                    updateResource.Name = cm.Files[index].FileName;
                    db.Resources.Update(updateResource);
                    db.SaveChanges();
                }
                else
                {
                    var newResource = new Resource();
                    {
                        newResource.Path = "./App_Data/Resources/" + updateCourse.Id + "-" + index + ".pdf";
                        newResource.Name = cm.Files[index].FileName;
                    }

                    db.Resources.Add(newResource);
                    db.SaveChanges();
                    resourceId = newResource.Id;
                }
                using (var stream = new FileStream("./App_Data/Resources/" + updateCourse.Id + "-" + index + ".pdf", FileMode.Create))//create new file
                {
                    await cm.Files[index].CopyToAsync(stream);
                    
                }
                      
                index++;

                JToken result;
                JObject parsedObject = JObject.Parse(lesson);
                if (parsedObject.TryGetValue("id", out result))
                {
                    int lessonId = int.Parse(parsedObject.GetValue("id").ToString());
                    var updateLesson = db.Lessons.FirstOrDefault(l => l.Id == lessonId);
                    updateLesson.Name = parsedObject.GetValue("name").ToString();
                    updateLesson.Description = parsedObject.GetValue("description").ToString();

                    db.Lessons.Update(updateLesson);
                    db.SaveChanges();
                }
                else
                {
                    var newLesson = new Lesson
                    {
                        Name = parsedObject.GetValue("name").ToString(),
                        Description = parsedObject.GetValue("description").ToString(),
                        CourseId = courseId,
                        ResourceId = resourceId // if its new lesson cm[Files] will be different than null since user will have to provide a file
                    };

                    db.Lessons.Add(newLesson);
                    db.SaveChanges();
                }
               
            }

            if (cm.Exercises != null)
            {
                foreach (string exercise in cm.Exercises)
                {
                    int exerciseId;
                    JToken result;
                    JObject parsedObject = JObject.Parse(exercise);
                    if (parsedObject.TryGetValue("id", out result))
                    {
                        var updateExercise = db.Exercises.FirstOrDefault(l => l.Id == int.Parse(parsedObject.GetValue("id").ToString()));
                        updateExercise.Name = parsedObject.GetValue("name").ToString();
                        updateExercise.Description = parsedObject.GetValue("description").ToString();

                        db.Exercises.Update(updateExercise);
                        db.SaveChanges();

                        exerciseId = updateExercise.Id;

                    }
                    else
                    {
                        var newExercise = new Exercise
                        {
                            Name = parsedObject.GetValue("name").ToString(),
                            Description = parsedObject.GetValue("description").ToString(),
                            CourseId = updateCourse.Id
                        };

                        db.Exercises.Add(newExercise);
                        db.SaveChanges();

                        exerciseId = newExercise.Id;
                    }
                    foreach (JObject question in parsedObject.GetValue("questions"))
                    {
                        int questionId;
                        if (question.TryGetValue("id", out result))
                        {
                            var updateQuestion = db.Questions.FirstOrDefault(q => q.Id == int.Parse(question.GetValue("id").ToString()));
                            updateQuestion.Sentence = question.GetValue("sentence").ToString();
                            updateQuestion.Points = float.Parse(question.GetValue("points").ToString());

                            db.Questions.Update(updateQuestion);
                            db.SaveChanges();

                            questionId = updateQuestion.Id;
                        }
                        else
                        {
                            var newQuestion = new Question
                            {
                                Sentence = question.GetValue("sentence").ToString(),
                                Points = float.Parse(question.GetValue("points").ToString()),
                                ExerciseId = exerciseId
                            };

                            db.Questions.Add(newQuestion);
                            db.SaveChanges();

                            questionId = newQuestion.Id;
                        }

                        foreach (JObject answer in question.GetValue("answers"))
                        {
                            if (answer.TryGetValue("id", out result))
                            {
                                var updateAnswer = db.Answers.FirstOrDefault(a => a.Id == int.Parse(answer.GetValue("id").ToString()));
                                updateAnswer.Sentence = answer.GetValue("sentence").ToString();
                                updateAnswer.IsCorrect = Convert.ToBoolean(answer.GetValue("isCorrect").ToString());

                                db.Answers.Update(updateAnswer);
                                db.SaveChanges();
                            }
                            else
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
            }
            return Json(new { message = "Success!" });
        }

        [HttpDelete("{id}"), Authorize, Route("/Course/Delete")]
        public IActionResult Delete( int id)
        {
            var courseExists = db.Courses.Any(c => c.Id == id);

            if(!courseExists)
            {
                return Json(new { message = "Course delete failed!" });
            }

            var deleteCourse = db.Courses.FirstOrDefault(c => c.Id == id);
            if(deleteCourse.Owner != User.Identity.Name)
            {
                return Json(new { message = "You don't own the course!" });
            }
            var resourceIds = db.Lessons.Where(l => l.CourseId == id).Select(l => l.ResourceId).ToList();
            foreach(int resourceId in resourceIds)
            {
                var removeResource = db.Resources.FirstOrDefault(r => r.Id == resourceId);
                System.IO.File.Delete(removeResource.Path);
                db.Resources.Remove(removeResource);
                db.SaveChanges();
            }

            db.Courses.Remove(deleteCourse); //EF will delete lessons and excercises by itself, but resources i had to manually delete
            db.SaveChanges();

            return Json(new { message = "Success!" });
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
