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
using System.Collections.Generic;

namespace Joost.Api.Controllers
{
    [RoutePrefix("api/account")]
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

        // GET: api/account/myprofile
        [HttpGet]
        [Route("myprofile")]
        public async Task<IHttpActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(UserProfileDto.FromModel(user));
        }

        // PUT: api/account/myprofile
        [HttpPut]
        [Route("myprofile")]
        public async Task<IHttpActionResult> SetProfile([FromBody]UserProfileDto profile)
        {
            var user = await _unitOfWork.Repository<User>().GetAsync(profile.Id);
            user.Email = profile.Email;
            user.Password = profile.Password;
            user.FirstName = profile.FirstName;
            user.LastName = profile.LastName;
            user.City = profile.City;
            user.Country = profile.Country;
            user.BirthDate = profile.BirthDate;
            user.Gender = profile.Gender;
            user.Status = profile.Status;
            user.Avatar = profile.Avatar;
            user.State = profile.State;

            await _unitOfWork.SaveAsync();
            return Ok(user);
        }

        // GET: api/account/name
        [HttpGet]
        [AccessTokenAuthorization]
        public IHttpActionResult GetUsers(string name)
        {
            var curUsertId = GetCurrentUserId();
            var users = _unitOfWork.Repository<User>()
                .Query()
                .Where(item =>
                    item.Id != curUsertId &&
                    (!string.IsNullOrEmpty(item.LastName)
                    && !string.IsNullOrEmpty(item.FirstName)
                    && (item.FirstName + " " + item.LastName).Contains(name)
                    || item.Email.Contains(name)))
                .Select(user => new UserSearchDto()
                {
                    Avatar = user.Avatar,
                    City = user.City,
                    Id = user.Id,
                    Name = user.FirstName + " " + user.LastName
                })
                .ToList();
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }

        // PUT: api/account/5
        [HttpPut]
        public async Task<IHttpActionResult> EditUser([FromBody]User user)
        {
            var id = GetCurrentUserId();
            user.Id = id;
            _unitOfWork.Repository<User>().Attach(user);
            await _unitOfWork.SaveAsync();

            return Ok(user);
        }

        // POST api/account/auth
        [Route("auth")]
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
                return StatusCode(System.Net.HttpStatusCode.Forbidden);
            }

            var accessToken = new AccessTokenDto() { AT_UserId = user.Id, AT_Time = DateTime.Now };
            var refreshToken = new RefreshTokenDto() { RT_UserId = user.Id, RT_Time = DateTime.Now, RT_AccessToken = accessToken };
            return Ok(new { accessToken = Encrypt.EncryptAccessToken(accessToken), refreshToken = Encrypt.EncryptRefreshToken(refreshToken) });
        }

        // GET: api/account/state
        [HttpGet]
        [Route("state")]
        public async Task<IHttpActionResult> GetState()
        {
            var id = GetCurrentUserId();
            var user = await _unitOfWork.Repository<User>().GetAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user.Status);
        }


        // Get api/account/refresh
        [Route("refresh")]
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
