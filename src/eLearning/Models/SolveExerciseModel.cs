using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eLearning.Models
{
    [NotMapped]
    public class SolveExerciseModel
    {
        [Required, Range(0,100)]
        public float Score;
        [Required]
        public int Id;
    }
}
