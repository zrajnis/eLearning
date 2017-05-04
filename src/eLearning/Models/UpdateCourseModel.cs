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
        public IList<string> Resources { get; set; } //names of the files, so if user didnt change anything we just send the name of already existing file instead of reuploading the file itself
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
