using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace eLearning.Models
{
    public class User
    {
        public int UserId { get; set; }
        [Required, RegularExpression(@"^[a-zA-Z.'\s]+$"), MinLength(2), MaxLength(32)]
        public string FirstName { get; set; }
        [Required, RegularExpression(@"^[a-zA-Z.'\s]+$"), MinLength(2), MaxLength(32)]
        public string LastName { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required, MinLength(4), MaxLength(16)]
        public string Password { get; set; }

        public List<Subscription> Subscriptions { get; set; }
        public List<ExerciseResult> ExerciseResults { get; set; }
    }
}
