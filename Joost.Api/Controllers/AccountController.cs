using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Threading.Tasks;
using System.Web.Http;
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
		public async Task<IHttpActionResult> Auth([FromBody]LoginTDO login)
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
            var token = new TokenTDO() { UserId = user.Id, Time = DateTime.Now };

            return Ok(new { token = Encrypt.EncryptToken(token) });
        }

		// Get api/account/auth
		[Route("api/account/auth")]
		[HttpGet]
		public async Task<IHttpActionResult> GetId(string token)
		{
			TokenTDO tok = null;
			try
			{
				tok = Encrypt.DecryptToken(token);
				return Ok(tok.UserId);
			}
			catch
			{
				return BadRequest();
			}
		}

	}
}
