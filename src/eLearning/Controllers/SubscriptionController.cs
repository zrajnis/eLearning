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
    public class SubscriptionController : Controller
    {
        private eLearningContext db;
        private UserManager<User> _userManager;

        public SubscriptionController(UserManager<User> userManager, eLearningContext context)
        {
            _userManager = userManager;
            db = context;
        }

        [HttpPost, Authorize, Route("/Course/Subscribe")]
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

        [HttpPost, Authorize, Route("/Course/Unsubscribe")]
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
    }
}
