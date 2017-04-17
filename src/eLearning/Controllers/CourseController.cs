using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using eLearning.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace eLearning.Controllers
{
    public class CourseController : Controller
    {
        // GET: /<controller>/
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
        public IActionResult Create([FromForm]CreateCourseModel cm)
        {
            //dont use array of strings but one and split it
            List<Lesson> lessons = new List<Lesson>();
            List<Exercise> exercises = new List<Exercise>();
            List<Question> questions = new List<Question>();
            List<Answer> answers = new List<Answer>();

            //JToken c = JToken.Parse(cm.Lessons);

            foreach (string lesson in cm.Lessons)
            {
                JObject parsedObject = JObject.Parse(lesson);
                Lesson newLesson = new Lesson
                {
                    Name = parsedObject.GetValue("Name").ToString(),
                    Description = parsedObject.GetValue("Description").ToString()
                };

                lessons.Add(newLesson);
            }

            foreach(string exercise in cm.Exercises)
            {
                JObject parsedObject = JObject.Parse(exercise);
                Exercise newExercise = new Exercise
                {
                    Name = parsedObject.GetValue("Name").ToString(),
                    Description = parsedObject.GetValue("Description").ToString()
                };

                exercises.Add(newExercise);

                foreach(JObject question in parsedObject.GetValue("Questions"))
                {
                    Question newQuestion = new Question
                    {
                        Sentence = question.GetValue("Sentence").ToString(),
                        Points = float.Parse(question.GetValue("Points").ToString())
                    };

                    questions.Add(newQuestion);

                    foreach(JObject answer in question.GetValue("Answers"))
                    {
                        Answer newAnswer = new Answer
                        {
                            Sentence = answer.GetValue("Sentence").ToString(),
                            IsCorrect = Convert.ToBoolean(answer.GetValue("IsCorrect").ToString())
                        };

                        answers.Add(newAnswer);
                    }
                }
            }
            return View();
        }
    }
}
