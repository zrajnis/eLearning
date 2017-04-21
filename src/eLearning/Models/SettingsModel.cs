using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.ModelState
{
    [NotMapped]
    public class SettingsModel
    {   //no data annotations since we'll only evalute 1 field per action for this model, rather than creating 3 different models and using data annotations
        public string FirstName { get; set; } 
        public string LastName { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string RePassword { get; set; }
    }
}
