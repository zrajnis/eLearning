using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using eLearning.Models;

namespace eLearning.Controllers
{
    public class HomeController : Controller
    {
        private eLearningContext db;

        public HomeController(eLearningContext context)
        {
            db = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Signin([FromBody]User user)
        {

            return Json(new {message = "Success" });
        }

        [HttpPost]
        public IActionResult Signup([FromBody]User user)
        {
            var emailInUse = db.Users.Count(u => u.Email == user.Email);
            if(emailInUse > 0)
            {
                return Json(new { message = "Email already in use" });
            }

            db.Users.Add(user);
            db.SaveChanges();
            return Json(new { message = "Success" });
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
