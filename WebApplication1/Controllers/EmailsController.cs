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


namespace WebApplication1.Models
{
    public class EmailsController : Controller
    {
        
        [HttpPost]
        public JsonResult SendPDFEmail(Common model)
        {

            DataTable dt = new DataTable();
            dt.Columns.AddRange(new DataColumn[2] {
                                new DataColumn("Field"),
                                new DataColumn("Value")});
            for (int i = 0; i < model.FormValues.Count; i++)
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
                    sb.Append("<tr><td align='center' style='background-color: #18B5F0' colspan = '2'><b>Zaytran Inc. Sizer Forms</b></td></tr>");
                    sb.Append("<tr><td align='center' style='background-color: #18B5F0' colspan = '2'>Telephone: 440-324-2814</td></tr>");
                    sb.Append("<tr><td align='center' style='background-color: #18B5F0' colspan = '2'>email: support@grippers.com</td></tr>");
                    sb.Append("<tr><td colspan = '2'></td></tr>");
                    sb.Append("</td><td><b>Date: </b>");
                    sb.Append(DateTime.Now);
                    sb.Append(" </td></tr>");
                    sb.Append("<tr><td colspan = '2'><b>Company Name :</b> ");
                    sb.Append(companyName);
                    sb.Append("</td></tr>");
                    sb.Append("</td><td><b>Customer Name: </b>");
                    sb.Append(model.Email.Username);
                    sb.Append(" </td></tr>");
                    sb.Append("<tr><td colspan = '2'><b>Customer Email :</b> ");
                    sb.Append(model.Email.EmailAdd);
                    sb.Append("</td></tr>");
                    sb.Append("</table>");
                    sb.Append("<br />");
                    sb.Append("<table border = '1'>");


                    var index = 0;
                    var x = 0;
                    foreach (DataRow row in dt.Rows)
                    {
                        index = x;

                        if (index == 0 || index == 10 || index == 15)
                        {
                            sb.Append("<tr style = 'text-align:center; font-weight:bold;'>");
                        }
                   
                        else
                        {
                            sb.Append("<tr style= 'text-align:left'>");
                        }
                        foreach (DataColumn column in dt.Columns)
                        {
                            if (index == 16 || index == 22)
                            {
                                sb.Append("<td bgcolor='yellow'>");
                                sb.Append(row[column]);
                                sb.Append("</td>");
                            }
                            else
                            {
                                sb.Append("<td>");
                                sb.Append(row[column]);
                                sb.Append("</td>");
                            }
                        }
                        sb.Append("</tr>");
                        x++;
                    }
                    sb.Append("</table>");
                    StringReader sr = new StringReader(sb.ToString());

                    Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
#pragma warning disable CS0612 // Type or member is obsolete
#pragma warning disable CS0612 // Type or member is obsolete
                    HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
#pragma warning restore CS0612 // Type or member is obsolete
#pragma warning restore CS0612 // Type or member is obsolete
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
                        pdfDoc.Open();
                        htmlparser.Parse(sr);
                        pdfDoc.Close();
                        byte[] bytes = memoryStream.ToArray();
                        memoryStream.Close();

                        MailMessage mm = new MailMessage("donotreply.zaytranautomation@gmail.com", model.Email.EmailAdd);
                        mm.Subject = "Gripper Sizer Form";
                        mm.Body = "Hello " + model.Email.Username + "! Thank you for using grippers.com. Attatched is your Gripper Sizer Form. <br><br>" +
                            "For any questions please email us at support@grippers.com or call 440-324-2814";
                        mm.Attachments.Add(new Attachment(new MemoryStream(bytes), "iTextSharpPDF.pdf"));
                        mm.IsBodyHtml = true;
                        SmtpClient smtp = new SmtpClient();
                        smtp.Host = "smtp.gmail.com";
                        smtp.EnableSsl = true;
                        smtp.UseDefaultCredentials = false;
                        NetworkCredential NetworkCred = new NetworkCredential();
                        NetworkCred.UserName = "donotreply.zaytranautomation@gmail.com";
                        NetworkCred.Password = "W3S3llgrippers";                        
                        smtp.Credentials = NetworkCred;
                        smtp.Port = 587;
                        smtp.Send(mm);

                        MailMessage mb = new MailMessage("donotreply.zaytranautomation@gmail.com", "support@grippers.com");
                        mb.Subject = "Gripper Sizer Form";
                        mb.Body = "Attatched is a new Gripper Sizer Form. <br><br> The User is " + model.Email.Username + " and they can be contacted at " + model.Email.EmailAdd;
                        mb.Attachments.Add(new Attachment(new MemoryStream(bytes), "iTextSharpPDF.pdf"));
                        mb.IsBodyHtml = true;
                        SmtpClient smtb = new SmtpClient();
                        smtb.Host = "smtp.gmail.com";
                        smtb.EnableSsl = true;
                        smtb.UseDefaultCredentials = false;
                        NetworkCredential NetworkCreb = new NetworkCredential();
                        NetworkCreb.UserName = "donotreply.zaytranautomation@gmail.com";
                        NetworkCreb.Password = "W3S3llgrippers";
                        smtb.Credentials = NetworkCred;
                        smtb.Port = 587;
                        smtb.Send(mb);
                    }

                }
            }
            string alerttext = "Your email has been sent";
            return Json(alerttext, JsonRequestBehavior.AllowGet);

        }
    }
}