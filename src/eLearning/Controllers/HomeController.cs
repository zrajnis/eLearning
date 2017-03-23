using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace eLearning.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Signin()
        {
            return Json(new {message = "Success" });
        }

        [HttpPost]
        public JsonResult Signup()
        {

            return Json(new { message = "Success" });
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
