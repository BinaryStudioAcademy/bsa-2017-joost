using Joost.Api.Infrastructure;
using Joost.Api.Models;
using Joost.DbAccess.DAL;
using Joost.DbAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Joost.Api.Filters
{
    public class TokenAuthorizationAttribute: ActionFilterAttribute
    {
        /*
        public TimeSpan expiryTime { get; set; } = new TimeSpan(24, 0, 0);

        public TokenAuthorizationAttribute()
        {
            
        }
        */

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (!actionContext.Request.Headers.Contains("Authorization"))
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.MethodNotAllowed,
                    Content = new StringContent("I didn't see your token in request")
                };
            }
            TokenTDO token = null;
            try
            {
                token = Encrypt.DecryptToken(actionContext.Request.Headers.GetValues("Authorization").First());
            }
            catch
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.MethodNotAllowed,
                    Content = new StringContent("Invalid token")
                };
                return;
            }

            var unitOfWork = new UnitOfWork();
            var user = unitOfWork.Repository<User>().Get(token.UserId);
            if (user == null)
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.MethodNotAllowed,
                    Content = new StringContent("Invalid userID")
                };
            }
            /*
            if (DateTime.Now - token.Time > expiryTime)
            {
                actionContext.Response = new HttpResponseMessage
                {
                    StatusCode = System.Net.HttpStatusCode.MethodNotAllowed,
                    Content = new StringContent("Token life has expired")
                };
            } */
        }
    }
}
