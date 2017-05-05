using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using eLearning.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace eLearning.Controllers
{
    public class ExerciseController : Controller
    {
        private eLearningContext db;
        private UserManager<User> _userManager;

        public ExerciseController(UserManager<User> userManager, eLearningContext context)
        {
            _userManager = userManager;
            db = context;
        }

        [HttpGet("{id}"), Authorize, Route("/Exercise")]
        public IActionResult Index(int id)
        {
            return View("Index");
        }

        [HttpGet("/Exercise/Load/{id}"), Authorize, Route("/Exercise/Load")]
        public IActionResult Load(int id)
        {
            var loadExercise = (from e in db.Exercises
                                where e.Id == id
                                let questions = (from q in db.Questions
                                                 where q.ExerciseId == e.Id
                                                 let answers = (from a in db.Answers
                                                                where a.QuestionId == q.Id
                                                                select a).ToList()
                                                 select new { sentence = q.Sentence, points = q.Points, id = q.Id, answers = answers }).ToList()
                                select new
                                {
                                    name = e.Name,
                                    description = e.Description,
                                    id = e.Id,
                                    questions = questions
                                }).ToList();
                                  
            return Json(new
            {
                exercise = loadExercise,
            });
        }
    }
}
