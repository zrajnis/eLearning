using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class User : IdentityUser
    {
        [Required, RegularExpression(@"^[a-zA-Z.'\s]+$"), MinLength(2), MaxLength(32)]
        public string FirstName { get; set; }
        [Required, RegularExpression(@"^[a-zA-Z.'\s]+$"), MinLength(2), MaxLength(32)]
        public string LastName { get; set; }
        [Required, RegularExpression(@"^(?=.*\d).{6,}$")] //technically data annotations arent needed but with them we go through less code if password is invalid 
        public string Password { get; set; } //password also has built in validation in Identity which is overriden in Startup.cs to match data annotations

        public List<Subscription> Subscriptions { get; set; }
        public List<ExerciseResult> ExerciseResults { get; set; }
    }
}
