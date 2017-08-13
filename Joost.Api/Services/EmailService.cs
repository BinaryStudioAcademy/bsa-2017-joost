using Joost.Api.Models;
using System;
using System.Net;
using System.Net.Mail;
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

        public Guid SendEmail(LoginModel user)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(email);
                mail.To.Add(user.Email);
                mail.IsBodyHtml = true;
                mail.Subject = "Invitation to Joost Team";
                mail.Body = $"<div> <h3>Hi!</h3><br /> ";
                mail.Body += $"<p>You registered on our messenger. If you want to log in, you should use following link: ";
                mail.Body += $"<a href='{url}confirm-registration?key={key.ToString()}'>Joost</a></p>";
                mail.Body += $"<p>Your credentials: </p>";
                mail.Body += $"<p> Login: {user.Email}</p>" +
                             $"<p> Password: {user.Password} </p> <br /><br />";
                mail.Body += $"<p>Regards,</p>";
                mail.Body += $"<p>Joost Support</p>";
                mail.Body += $"</div>";


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