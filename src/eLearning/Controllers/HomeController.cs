using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using eLearning.Models;
using Microsoft.AspNetCore.Identity;

namespace eLearning.Controllers
{
    public class HomeController : Controller
    {
        private UserManager<User> _userManager;

        public HomeController(UserManager<User> userManager)
        {
            _userManager = userManager;

        }

        public IActionResult Index()
        {
            if(User.Identity.IsAuthenticated)
            {
                return View("LoggedIn");
            }
            return View();
        }

        public IActionResult LoggedIn()
        {
           return RedirectToAction("Index");
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
