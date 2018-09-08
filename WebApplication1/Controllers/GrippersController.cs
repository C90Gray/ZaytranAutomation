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
        private ZaytranAutomationEntities db = new ZaytranAutomationEntities();

        // GET: Grippers
        public ActionResult Index()
        {
            return View(db.Grippers.ToList());
        }

        // GET: Grippers/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Gripper gripper = db.Grippers.Find(id);
            if (gripper == null)
            {
                return HttpNotFound();
            }
            return View(gripper);
        }

        // GET: Grippers/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Grippers/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "GripperID,GripperName,Stroke__in_,Force_ID,Force_OD,Ma,Mb_Mc,Price")] Gripper gripper)
        {
            if (ModelState.IsValid)
            {
                db.Grippers.Add(gripper);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(gripper);
        }

        // GET: Grippers/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Gripper gripper = db.Grippers.Find(id);
            if (gripper == null)
            {
                return HttpNotFound();
            }
            return View(gripper);
        }

        // POST: Grippers/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "GripperID,GripperName,Stroke__in_,Force_ID,Force_OD,Ma,Mb_Mc,Price")] Gripper gripper)
        {
            if (ModelState.IsValid)
            {
                db.Entry(gripper).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(gripper);
        }

        // GET: Grippers/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Gripper gripper = db.Grippers.Find(id);
            if (gripper == null)
            {
                return HttpNotFound();
            }
            return View(gripper);
        }

        // POST: Grippers/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Gripper gripper = db.Grippers.Find(id);
            db.Grippers.Remove(gripper);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
        public JsonResult FindModels(float Ma, float Mb)
        {
            if (double.IsNaN(Ma) || double.IsNaN(Mb))
            {
                var Error = "An error has occured. Please make sure all fields have an entry.";
                return Json(Error, JsonRequestBehavior.AllowGet);
            }
            var Models = (from g in db.Grippers
                          where g.Ma >= Ma && g.Mb_Mc >= Mb
                          orderby g.Price ascending
                          select g).ToArray();

            return Json(Models, JsonRequestBehavior.AllowGet);
        }
    }
}
