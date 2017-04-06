﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using eLearning.Models;
using System.Text.RegularExpressions;

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

        [HttpPost]
        public async Task<IActionResult> SignUp([FromBody]User user)
        {
            if (ModelState.IsValid)
            {
                var emailCount = db.Users.Count(u => u.Email == user.Email);

                if (emailCount > 0)
                {
                    return Json(new { message = "Email already in use." });
                }

                var newUser = new User { UserName = user.Email, Email = user.Email, FirstName = user.FirstName, LastName = user.LastName };
                var result = await _userManager.CreateAsync(newUser, user.Password);

                if (result.Succeeded)
                {
                    return Json(new { message = "Success!" });
                }
                else
                {
                    return Json(new { message = "Sign up failed." });
                } 
            }

            return Json(new { message = "Sign up failed." });
        }

        [HttpPost]
        public async Task<IActionResult> SignIn([FromBody]SignInModel user)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(user.Email, user.Password, true, false);

                if (result.Succeeded)
                {
                    
                    return Json(new { message = "Success!" });
                }
                return Json(new { message = "Sign in failed." });
            }

            return Json(new { message = "Sign in failed." });
        }

        [HttpPost]
        public async Task<IActionResult> SignOut()
        {
            await _signInManager.SignOutAsync();
            return Json(new { message = "Success!" });
        }

        [HttpPost][Route("/Account/Change/FirstName")]
        public async Task<IActionResult> ChangeFirstName([FromBody]SettingsModel sm)
        {
            var nameRegex = new Regex(@"^[a-zA-Z.'\s]{2,32}$");
            if (nameRegex.IsMatch(sm.FirstName))
            {
                var identity = User.Identity.Name;

                User updatedUser = db.Users.FirstOrDefault(u => u.UserName == identity);
                updatedUser.FirstName = sm.FirstName;
                db.Users.Update(updatedUser);
                db.SaveChanges();

                return Json(new { message = "Success!" });
            }
            return Json(new { message = "Please enter a valid first name!" });
        }

        [HttpPost][Route("/Account/Change/LastName")]
        public async Task<IActionResult> ChangeLastName([FromBody]SettingsModel sm)
        {
            var nameRegex = new Regex(@"^[a-zA-Z.'\s]{2,32}$");
            if (nameRegex.IsMatch(sm.LastName))
            {
                var identity = User.Identity.Name;

                User updatedUser = db.Users.FirstOrDefault(u => u.UserName == identity);
                updatedUser.LastName = sm.LastName;
                db.Users.Update(updatedUser);
                db.SaveChanges();

                return Json(new { message = "Success!" });
            }
            return Json(new { message = "Please enter a valid last name!" });
        }

        [HttpPost][Route("/Account/Change/Password")]
        public async Task<IActionResult> ChangePassword([FromBody]SettingsModel sm)
        {
            var passwordRegex = new Regex(@"^(?=.*\d).{6,}$");
            if (passwordRegex.IsMatch(sm.OldPassword) && passwordRegex.IsMatch(sm.NewPassword) && sm.NewPassword == sm.RePassword)
            {
                var identity = User.Identity.Name;

                User updatedUser = db.Users.FirstOrDefault(u => u.UserName == identity);
                var result = await _userManager.ChangePasswordAsync(updatedUser, sm.OldPassword, sm.NewPassword);
                if (result.Succeeded)
                {
                    return Json(new { message = "Success!" });
                }
                else //only reason that can cause failure is that current password is incorrect (since we already found user and new password passed validations)
                {
                    return Json(new { message = "Incorrect current password!" });
                }
            }
            else if (!passwordRegex.IsMatch(sm.OldPassword))
            {
                return Json(new { message = "Invalid old password!" });
            }
            else if (!passwordRegex.IsMatch(sm.NewPassword))
            {
                return Json(new { message = "Invalid new password!" });
            }
            return Json(new { message = "Passwords must match!" });
        }
    }
}
