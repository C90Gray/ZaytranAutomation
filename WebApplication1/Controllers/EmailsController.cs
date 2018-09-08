using System.IO;
using System.Text;
using System.Data;
using System.Net;
using System.Net.Mail;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.html.simpleparser;
using System.Web.UI;
using System.Web.Mvc;
using System;
using System.Web.Script.Serialization;
using WebApplication1.Controllers;
using Newtonsoft.Json;

namespace WebApplication1.Models
{
    public class EmailsController : Controller
    {
        
        [HttpPost]
        public JsonResult SendPDFEmail(Email model)
        {
           
            Console.WriteLine(model.FormValues);

            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[2] {
                                new DataColumn("Field"),
                                new DataColumn("Value")});
            for (int i = 0; i < model.FormValues.Length; i++)
            {
                dt.Rows.Add(model.FormValues[i].Field, model.FormValues[i].Value);
            }


            using (StringWriter sw = new StringWriter())
            {
                using (HtmlTextWriter hw = new HtmlTextWriter(sw))
                {
                    string companyName = "Zaytran Automation";
                    StringBuilder sb = new StringBuilder();
                    sb.Append("<table width='100%' cellspacing='0' cellpadding='2'>");
                    sb.Append("<tr><td align='center' style='background-color: #18B5F0' colspan = '2'><b>Order Sheet</b></td></tr>");
                    sb.Append("<tr><td colspan = '2'></td></tr>");
                    sb.Append("</td><td><b>Date: </b>");
                    sb.Append(DateTime.Now);
                    sb.Append(" </td></tr>");
                    sb.Append("<tr><td colspan = '2'><b>Company Name :</b> ");
                    sb.Append(companyName);
                    sb.Append("</td></tr>");
                    sb.Append("</table>");
                    sb.Append("<br />");
                    sb.Append("<table border = '1'>");
                    sb.Append("<tr>");
                    foreach (DataColumn column in dt.Columns)
                    {
                        sb.Append("<th style = 'background-color: #D20B0C;color:#ffffff'>");
                        sb.Append(column.ColumnName);
                        sb.Append("</th>");
                    }
                    sb.Append("</tr>");
                    foreach (DataRow row in dt.Rows)
                    {
                        sb.Append("<tr>");
                        foreach (DataColumn column in dt.Columns)
                        {
                            sb.Append("<td>");
                            sb.Append(row[column]);
                            sb.Append("</td>");
                        }
                        sb.Append("</tr>");
                    }
                    sb.Append("</table>");
                    StringReader sr = new StringReader(sb.ToString());

                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
                    HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
                        pdfDoc.Open();
                        htmlparser.Parse(sr);
                        pdfDoc.Close();
                        byte[] bytes = memoryStream.ToArray();
                        memoryStream.Close();

                        MailMessage mm = new MailMessage("donotreply.zaytranautomation@gmail.com", model.Mail);
                        mm.Subject = "Gripper Sizer Form";
                        mm.Body = "Hello, " + model.Username + ", Thank you for using grippers.com. Attatched is your Gripper Sizer Form";
                        mm.Attachments.Add(new Attachment(new MemoryStream(bytes), "iTextSharpPDF.pdf"));
                        mm.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = "smtp.gmail.com";
                        smtp.EnableSsl = true;
                        NetworkCredential NetworkCred = new NetworkCredential();
                        NetworkCred.UserName = "donotreply.zaytranautiomation@gmail.com";
                        NetworkCred.Password = "W3S3llgrippers";
                        smtp.UseDefaultCredentials = true;
                        smtp.Credentials = NetworkCred;
                        smtp.Port = 587;
                        smtp.Send(mm);
                    }

                }
            }
            string alerttext = "Your email has been sent";
            return Json(alerttext, JsonRequestBehavior.AllowGet);

        }
    }
}