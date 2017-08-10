using Joost.Api.ViewModel;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using Joost.DbAccess.DAL;
using Joost.DbAccess.EF;

namespace Joost.Api.Controllers
{
	public class AccountController : BaseApiController
    {
        public AccountController(IUnitOfWork unitOfWork) : base(unitOfWork) {}
        
        // POST api/account/auth
        [Route("api/account/auth")]
        [HttpPost]
		public async Task<IHttpActionResult> Auth([FromBody]LoginViewModel login)
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
            return Ok(new { UserId = user.Id, Time = (int)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds });
        }
	}
}
