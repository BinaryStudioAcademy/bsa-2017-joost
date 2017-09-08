using Joost.Api.Models;
using System;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Configuration;

namespace Joost.Api.Services
{
    public class EmailService
    {
        private readonly Guid key;
        private readonly string url;
        private readonly string email;
        private readonly string password;

        public EmailService()
        {
            url = $"http://localhost:4200/";
            key = Guid.NewGuid();
            email = WebConfigurationManager.AppSettings["Email"];
            password = WebConfigurationManager.AppSettings["Password"];
        }

        public Guid SendEmail(LoginDto user)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(email);
                mail.To.Add(user.Email);
                mail.IsBodyHtml = true;
                mail.Subject = "Invitation to Joost Team";
                //String path = HttpContext.Current.Server.MapPath("~/App_Data/logo.svg");
                //string logo;
                //using (Image image = Image.FromFile(path))
                //{
                //    using (MemoryStream m = new MemoryStream())
                //    {
                //        image.Save(m, image.RawFormat);
                //        byte[] imageBytes = m.ToArray();

                //        // Convert byte[] to Base64 String
                //        logo = Convert.ToBase64String(imageBytes);
                //    }
                //}
                mail.Body = @"<html><head><link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'></head><body><div style='text-align:center;font-family:Roboto'><div style='display:inline-block;background-color:#f9f5f2;'>"
                + "<table><tr><td>"
                + "<p style='text - align:center; margin: 20px 0px;font-size:24px;color:#3f51b5'>"
                //+ $"<img src='data:image/jpg;base64,{logo}' alt='logo' style='width: 250px;'>"
                + "Joost"
                + "</p></td></tr><tr><td style='padding:0px 50px;'>"
                + "<div style='background-color:white;padding:5px 0px;border-radius:3px;'>"
                + "<h1 style='text-align:center;margin:30px 0px;font-size:1.5em;'>Verify your account</h1>"
                + "<p style='text-align:center;'>"
                + $"Thanks for singing up.Confirm your email address <br>is " 
                + $"<a style='color:#a1d6c6 !important;text-decoration:none;'>{user.Email}</a>" 
                + $" to activate your account:"
                + $"</p><p style='text-align:center;'>" 
                + $"<a href='{url}confirm-registration?key={key.ToString()}' style='display:inline-block;background-color:#a1d6c6;padding:15px 60px ;margin-top:20px;text-decoration:none;color:white;margin-bottom:25px;border-radius:3px;'><strong>CONFIRM</strong></a>" 
                + $"</p></div></td></tr><tr><td style='text-align:center;font-size:0.9em;padding:30px 70px 20px;'>Having trouble with the links in the email? Copy and paste this link into your browser to verify:</td></tr><tr>"
                + "<td style='text-align:center;padding-bottom:40px;'>" 
                + $"<a href='{url}confirm-registration?key={key.ToString()}' style='margin-bottom:20px;padding-top:30px;text-decoration:none;color:#a1d6c6;'>{url}confirm-registration?key={key.ToString()}</a></td>" 
                + "</tr><tr><td style='text-align:center;padding-bottom:20px;font-size:0.85em;padding-top:0px;'> Have a question? Contact us: "
                + "<a href='mailto:joost.supp0rt@gmail.com' style='text-decoration:none;color:#a1d6c6;text-decoration:underline;'>joost.supp0rt@gmail.com</a>"
                + "</td></tr></table><div></div></body>";

                mail.Priority = MailPriority.High;
                SendEmail(mail);

                return key;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private void SendEmail(MailMessage message)
        {
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential(email, password);
            smtp.Timeout = 20000;

            smtp.EnableSsl = true;
            smtp.Send(message);
        }
    }
}