using eLearning.ModelState;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

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

        [HttpPost, Authorize]
        public async Task<IActionResult> SignOut()
        {
            await _signInManager.SignOutAsync();
            return Json(new { message = "Success!" });
        }

        [HttpPut, Authorize, Route("/Account/Change/FirstName")]
        public IActionResult ChangeFirstName([FromBody]SettingsModel sm)
        {
            var nameRegex = new Regex(@"^[a-zA-Z.'\s]{2,32}$");
            if (!String.IsNullOrWhiteSpace(sm.FirstName) && nameRegex.IsMatch(sm.FirstName))
            {
                User updateUser = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
                updateUser.FirstName = sm.FirstName;
                db.Users.Update(updateUser);
                db.SaveChanges();

                return Json(new { message = "Success!" });
            }
            return Json(new { message = "Please enter a valid first name!"});
        }

        [HttpPut, Authorize, Route("/Account/Change/LastName")]
        public IActionResult ChangeLastName([FromBody]SettingsModel sm)
        {
            var nameRegex = new Regex(@"^[a-zA-Z.'\s]{2,32}$");
            if (!String.IsNullOrWhiteSpace(sm.LastName) && nameRegex.IsMatch(sm.LastName))
            {
                User updateUser = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
                updateUser.LastName = sm.LastName;
                db.Users.Update(updateUser);
                db.SaveChanges();

                return Json(new { message = "Success!" });
            }
            return Json(new { message = "Please enter a valid last name!"});
        }

        [HttpPut, Authorize, Route("/Account/Change/Password")]
        public async Task<IActionResult> ChangePassword([FromBody]SettingsModel sm)
        {
            List<Object> errorList = new List<Object>();
            var passwordRegex = new Regex(@"^(?=.*\d).{6,}$");

            if (!String.IsNullOrWhiteSpace(sm.OldPassword) && !String.IsNullOrWhiteSpace(sm.NewPassword) && !String.IsNullOrWhiteSpace(sm.RePassword) &&
                passwordRegex.IsMatch(sm.OldPassword) && passwordRegex.IsMatch(sm.NewPassword) && sm.NewPassword == sm.RePassword)
            {
                User updateUser = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
                var result = await _userManager.ChangePasswordAsync(updateUser, sm.OldPassword, sm.NewPassword);
                if (result.Succeeded)
                {
                    return Json(new { message = "Success!" });
                }
                else //only reason that can cause failure is that current password is incorrect (since we already found user and new password passed validations)
                {
                    errorList.Add(new { message = "Incorrect current password!", inputID = "settingsOldPassword" });
                    return Json(new { errorList = errorList});
                }
            }
            else
            {   
                if (String.IsNullOrWhiteSpace(sm.OldPassword) || !passwordRegex.IsMatch(sm.OldPassword))
                {
                    errorList.Add(new { message = "Invalid old password!", inputID = "settingsOldPassword" });
                }
                if (String.IsNullOrWhiteSpace(sm.NewPassword) || !passwordRegex.IsMatch(sm.NewPassword))
                {
                    errorList.Add(new { message = "Invalid new password!", inputID = "settingsNewPassword" });
                }
                if(sm.NewPassword != sm.RePassword || String.IsNullOrWhiteSpace(sm.RePassword))
                {
                    errorList.Add(new { message = "Passwords must match!", inputID = "settingsRePassword" });
                }
                return Json(new { errorList = errorList });
            }
        }

        [HttpDelete, Authorize]
        public async Task<IActionResult> Deactivate()
        {
            User deleteUser = db.Users.FirstOrDefault(u => u.UserName == User.Identity.Name); //it will always find a user
            var result = await _userManager.DeleteAsync(deleteUser);
            if (result.Succeeded)
            {
                await _signInManager.SignOutAsync(); //if the user was deleted, sign him out ( if we sign out first, and deactivation fails then user gets signed out for no reason)
                return Json(new { message = "Success!" });
            }
            else
            {
                return Json(new { message = "Deactivation failed!" });
            }
        }
    }
}
