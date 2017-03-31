using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.Models
{
    [NotMapped]
    public class SignInModel
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required, RegularExpression(@"^(?=.*\d).{6,}$")]
        public string Password { get; set; }
    }
}
