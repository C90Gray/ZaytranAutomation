using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class GrippersController : Controller
    {
        //This finds models and returns them to the GetModels javascript function
        public JsonResult FindModels(GripperModels grips)
        {
            if (double.IsNaN(grips.User.UserMa) || double.IsNaN(grips.User.UserMb))
            {
                var Error = "An error has occured. Please make sure all fields have an entry.";
                Error.ToString();
                return Json(Error, JsonRequestBehavior.AllowGet);
            }
            if ((grips.User.UserMa == 0) || (grips.User.UserMb == 0))
            {
                var Error = "An error has occured. Please make sure all fields have an entry.";
                Error.ToString();
                return Json(Error, JsonRequestBehavior.AllowGet);
            }
            List<Specs> ModelList = new List<Specs>();

            for (int i =0; i < grips.Specs.Count; i++)
            {
                if (grips.Specs[i].Ma >= grips.User.UserMa && grips.Specs[i].MbMc >= grips.User.UserMb)
                {
                    ModelList.Add(grips.Specs[i]);
                }
            }

            Specs[] Models = ModelList.ToArray();

            return Json(Models, JsonRequestBehavior.AllowGet);
        }
    }
}
