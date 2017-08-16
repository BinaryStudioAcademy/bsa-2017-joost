using Joost.Api.Infrastructure;
using Joost.Api.Models;
using Joost.DbAccess.DAL;
using Joost.DbAccess.Entities;
using System;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Joost.Api.Filters
{
    public class AccessTokenAuthorizationAttribute: ActionFilterAttribute
    {
        private static TimeSpan accessTokenLifetime;

        static AccessTokenAuthorizationAttribute()
        {
            int countHours;
            if (int.TryParse(ConfigurationManager.AppSettings["accessTokenLifetime"], out countHours))
                accessTokenLifetime = new TimeSpan(countHours, 0, 0);
            else
                accessTokenLifetime = new TimeSpan(3, 0, 0);
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (!actionContext.Request.Headers.Contains("Authorization"))
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.MethodNotAllowed,
                    Content = new StringContent("I didn't see your access token in request")
                };
                return;
            }

            AccessTokenDto accessToken = null;
            try
            {
                accessToken = Encrypt.DecryptAccessToken(actionContext.Request.Headers.GetValues("Authorization").First());
            }
            catch
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.MethodNotAllowed,
                    Content = new StringContent("Invalid access token")
                };
                return;
            }

            using (var unitOfWork = new UnitOfWork())
            {
                var user = unitOfWork.Repository<User>().Get(accessToken.AT_UserId);
                if (user == null)
                {
                    actionContext.Response = new HttpResponseMessage
                    {
                        StatusCode = System.Net.HttpStatusCode.MethodNotAllowed,
                        Content = new StringContent("Invalid userID")
                    };
                    return;
                }
            }
 
            if (DateTime.Now - accessToken.AT_Time > accessTokenLifetime)
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.UpgradeRequired,
                    Content = new StringContent("Access token life has expired")
                };
                return;
            } 
        }
    }
}
