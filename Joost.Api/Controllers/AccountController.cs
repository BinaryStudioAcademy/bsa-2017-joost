﻿using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using Joost.DbAccess.DAL;
using Joost.DbAccess.EF;
using Joost.Api.Models;
using Joost.Api.Infrastructure;

namespace Joost.Api.Controllers
{
	public class AccountController : BaseApiController
    {
        public AccountController(IUnitOfWork unitOfWork) : base(unitOfWork) {}
        
        // POST api/account/auth
        [Route("api/account/auth")]
        [HttpPost]
		public async Task<IHttpActionResult> Auth([FromBody]LoginModel login)
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
            var token = new Token() { UserId = user.Id, Time = DateTime.Now };

            return Ok(Encrypt.EncryptToken(token));
        }
    }
}
