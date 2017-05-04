using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eLearning.Models
{
    public class UpdateCourseModel
    {
        public IList<IFormFile> Files { get; set; }
        [Required, MinLength(2), MaxLength(64)]
        public string Name { get; set; }
        [MinLength(2), MaxLength(240)]
        public string Description { get; set; }
        [Required]
        public int Id { get; set; }

        [Required, MinLength(1), MaxLength(10)]
        public string[] Lessons { get; set; }
        [MaxLength(10)]
        public string[] Exercises { get; set; }
        
        public string Removed { get; set; }
    }
}
