using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.PlatformAbstractions;
using eLearning.Models;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace eLearning.Controllers
{
    public class ResourceController : Controller
    {
        private eLearningContext db;

        public ResourceController( eLearningContext context)
        {
            db = context;
        }

        [HttpGet("Resource/Load/{id}"), Route("/Resource/Load")]
        public IActionResult Load(int id)
        {
            var appPath = PlatformServices.Default.Application.ApplicationBasePath;
            var resourceExists = db.Resources.Any(r => r.Id == id);

            appPath = appPath.Remove(appPath.Length - 24); //base path shows path to debug, we cut off unnecessary part so it points to project
            if (resourceExists)
            {
                var loadResource = db.Resources.FirstOrDefault(r => r.Id == id);
                return PhysicalFile(appPath + loadResource.Path, "application/pdf");
            }
            return Json(new { error = "Resource not found." });
        }
    }
}
