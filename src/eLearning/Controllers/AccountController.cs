using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using eLearning.Models;
using System.Diagnostics;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace eLearning.Controllers
{
    public class AccountController : Controller
    {
        private eLearningContext db;
        private SignInManager<User> _signInManager;
        private UserManager<User> _userManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, eLearningContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            db = context;
        }

        public async Task<IActionResult> SignUp([FromBody]User user)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { message = "Sign up failed." });
            }

            var emailCount = db.Users.Count(u => u.Email == user.Email);

            if (emailCount > 0)
            {
                return Json(new { message = "Email already in use." });
            }

            var newUser = new User { UserName = user.Email, Email = user.Email, FirstName = user.FirstName, LastName = user.LastName};
            var result = await _userManager.CreateAsync(newUser, user.Password);

            if(result.Succeeded)
            {
                await _signInManager.SignInAsync(newUser, true);
                return Json(new { message = "Success!" });
            }
            else
            {
                return Json(new { message = "Sign up failed." });
            }
        }
    }
}
