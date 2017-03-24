using System.Collections.Generic;

namespace eLearning.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
        public ICollection<Course> Courses { get; set; }
    }
}
