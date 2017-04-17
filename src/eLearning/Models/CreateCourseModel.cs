using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eLearning.Models
{
    [NotMapped]
    public class CreateCourseModel
    {
        public IList<IFormFile> Files { get; set; }
        [Required, MinLength(2), MaxLength(64)]
        public string Name { get; set; }
        [MinLength(2), MaxLength(240)]
        public string Description { get; set; }

        [Required, MinLength(1), MaxLength(10)]
        public string[] Lessons { get; set; }
        [MaxLength(10)]
        public string[] Exercises { get; set; }
    }
}