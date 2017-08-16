using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using Joost.Api.Models;
using Joost.Api.Infrastructure;
using Joost.Api.Filters;
using System.Linq;
using System.Configuration;

namespace Joost.Api.Controllers
{
    public class AccountController : BaseApiController
    {
        private static TimeSpan refreshTokenLifetime;

        static AccountController()
        {
            int countDays;
            if (int.TryParse(ConfigurationManager.AppSettings["refreshTokenLifetime"], out countDays))
                refreshTokenLifetime = new TimeSpan(countDays, 0, 0, 0);
            else
                refreshTokenLifetime = new TimeSpan(7, 0, 0, 0);
        }
        public AccountController(IUnitOfWork unitOfWork) : base(unitOfWork) { }
        
        // POST api/account/auth
        [Route("api/account/auth")]
        [HttpPost]
		public async Task<IHttpActionResult> Auth([FromBody]LoginDto login)
		{
           if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _unitOfWork.Repository<User>().FindAsync(t => t.Email == login.Email && t.Password == login.Password);

            if (user==null)
            {
                return NotFound();
            }

            if (!user.IsActived)
            {
                return StatusCode(System.Net.HttpStatusCode.PartialContent);
            }

            var accessToken = new AccessTokenDto() { AT_UserId = user.Id, AT_Time = DateTime.Now };
            var refreshToken = new RefreshTokenDto() { RT_UserId = user.Id, RT_Time = DateTime.Now, RT_AccessToken = accessToken };
            return Ok(new { accessToken = Encrypt.EncryptAccessToken(accessToken), refreshToken = Encrypt.EncryptRefreshToken(refreshToken) });
        }

		// Get api/account
		[Route("api/account")]
		[HttpGet]
        [AccessTokenAuthorization]
		public IHttpActionResult GetId()
		{
			return Ok(GetCurrentUserId());
		}

        // Get api/account/refresh
        [Route("api/account/refresh")]
        [HttpGet]
        public async Task<IHttpActionResult> RefreshTokens()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!Request.Headers.Contains("Authorization"))
            {
                return StatusCode(System.Net.HttpStatusCode.MethodNotAllowed);
            }

            RefreshTokenDto refreshToken = null;
            try
            {
                refreshToken = Encrypt.DecryptRefreshToken(Request.Headers.GetValues("Authorization").First());
            }
            catch
            {
                return StatusCode(System.Net.HttpStatusCode.MethodNotAllowed);
            }

            var user = await _unitOfWork.Repository<User>().GetAsync(refreshToken.RT_UserId);
            if (user == null)
            {
                return StatusCode(System.Net.HttpStatusCode.MethodNotAllowed);
            }

            if (DateTime.Now - refreshToken.RT_Time > refreshTokenLifetime)
            {
                return StatusCode(System.Net.HttpStatusCode.MethodNotAllowed);
            }

            var newAccessToken = new AccessTokenDto() { AT_UserId = user.Id, AT_Time = DateTime.Now };
            var newRefreshToken = new RefreshTokenDto() { RT_UserId = user.Id, RT_Time = DateTime.Now, RT_AccessToken = newAccessToken };
            return Ok(new { accessToken = Encrypt.EncryptAccessToken(newAccessToken), refreshToken = Encrypt.EncryptRefreshToken(newRefreshToken) });
        }
    }
}
