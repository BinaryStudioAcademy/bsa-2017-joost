using Joost.Api.Filters;
using Joost.Api.Models;
using Joost.Api.Services;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Joost.Api.Controllers
{
	[RoutePrefix("api/users")]
	public class UsersController : BaseApiController
	{
		public UsersController(IUnitOfWork unitOfWork) : base(unitOfWork) { }

		// GET: api/users
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

        // GET: api/users/5
        [HttpGet]
        [AccessTokenAuthorization]
        public async Task<IHttpActionResult> GetUser(int id)
		{
			var user = await _unitOfWork.Repository<User>().GetAsync(id);
			if (user == null)
			{
				return NotFound();
			}

			return Ok(UserDetailsDto.FromModel(user));
		}

		[HttpGet]
		[Route("contact")]
		public async Task<IHttpActionResult> GetContact()
		{
			var userId = GetCurrentUserId();
			var user = await _unitOfWork.Repository<User>().GetAsync(userId);
			if (user == null)
			{
				return NotFound();
			}
			var cont = user.Contacts.Select(t => new ContactDto() { ContactId = t.ContactUser.Id, State = t.State }).ToList();
			return Ok(cont);
		}

		[HttpGet]
		[Route("all-contact")]
		public async Task<IHttpActionResult> GetAllContact()
		{
			var userId = GetCurrentUserId();
			var user = await _unitOfWork.Repository<User>().GetAsync(userId);
			if (user == null)
			{
				return NotFound();
			}
			var cont = user.Contacts.Select(t => new UserContactDto {
				Id = t.ContactUser.Id,
				State = t.State,
				Avatar = t.ContactUser.Avatar,
				Name = t.ContactUser.FirstName + " " + t.ContactUser.LastName,
				City = t.ContactUser.City
			 }).OrderBy(t=>t.State).ToList();
			return Ok(cont);
		}

		// GET: api/users/state/5
		[HttpGet]
		[Route("state/{id}")]
		public async Task<IHttpActionResult> GetState(int id)
		{
			var user = await _unitOfWork.Repository<User>().GetAsync(id);
			if (user == null)
			{
				return NotFound();
			}

			return Ok(user.Status);
		}

		// GET: api/users/check/{login}
		[HttpGet]
		[Route("check")]
		public async Task<IHttpActionResult> CheckUserForUniqueness(string login)
		{
			if (string.IsNullOrEmpty(login))
			{
				return NotFound();
			}

			return Ok((await _unitOfWork.Repository<User>().FindAsync(i => i.Email == login)) == null);
		}

		// POST: api/users
		[HttpPost]
		public async Task<IHttpActionResult> AddUser([FromBody]LoginDto user)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var email = new EmailService();
			var checkUser = await _unitOfWork.Repository<User>().FindAsync(item => item.Email == user.Email);

			if (checkUser != null)
			{
				if (!checkUser.IsActived)
				{
					var checkConfirm = await _unitOfWork.Repository<ConfirmRegistration>().GetAsync(checkUser.Id);
					if(checkConfirm == null)
					{
						checkConfirm = new ConfirmRegistration();
						checkConfirm.Key = email.SendEmail(user).ToString();
						checkConfirm.DateOfRegistration = DateTime.Now;
						_unitOfWork.Repository<ConfirmRegistration>().Attach(checkConfirm);
					}
					else
					{
						checkConfirm.Key = email.SendEmail(user).ToString();
						checkConfirm.DateOfRegistration = DateTime.Now;
						_unitOfWork.Repository<ConfirmRegistration>().Attach(checkConfirm);
					}
					await _unitOfWork.SaveAsync();
				}
				else
				{
					return BadRequest("The user with this name already exists.");
				}
			}
			else
			{
				var key = email.SendEmail(user);
				var newUser = new User { Email = user.Email, Password = user.Password, IsActived = false, BirthDate = DateTime.UtcNow };
				_unitOfWork.Repository<User>().Add(newUser);
				_unitOfWork.Repository<ConfirmRegistration>().Add(new ConfirmRegistration() { Id = newUser.Id, Key = key.ToString(), DateOfRegistration = DateTime.Now });
				await _unitOfWork.SaveAsync();
			}

			return Ok();
		}

		// GET: api/users/confirmregistration
		[HttpGet]
		[Route("confirmregistration")]
		public async Task<IHttpActionResult> ConfirmRegistration(string key)
		{
			if (string.IsNullOrEmpty(key))
			{
				return NotFound();
			}
			var user = await _unitOfWork.Repository<ConfirmRegistration>().FindAsync(item => item.Key == key);
			if(user == null)
			{
				return BadRequest();
			}
			var activeUser = await _unitOfWork.Repository<User>().FindAsync(t => t.Id == user.Id);
			activeUser.IsActived = true;
			await _unitOfWork.SaveAsync();
			_unitOfWork.Repository<ConfirmRegistration>().Delete(user);
			await _unitOfWork.SaveAsync();

			return Ok(user.Id);
		}

		// PUT: api/users/5
		[HttpPut]
        [AccessTokenAuthorization]
        public async Task<IHttpActionResult> EditUser(int id, [FromBody]User user)
		{
			_unitOfWork.Repository<User>().Attach(user);
			await _unitOfWork.SaveAsync();

			return Ok(user);
		}

		// PUT: api/users/state/5
		[HttpPut]
        [AccessTokenAuthorization]
        public async Task<IHttpActionResult> EditState(int id, UserState state)
		{
			var user = await _unitOfWork.Repository<User>().GetAsync(id);
			user.State = state;
			_unitOfWork.Repository<User>().Attach(user);
			await _unitOfWork.SaveAsync();

			return Ok(user);
		}


		// DELETE: api/users/5
		[HttpDelete]
        [AccessTokenAuthorization]
        public async Task DeleteUser(int id)
		{
			var user = await _unitOfWork.Repository<User>().FindAsync(item => item.Id == id);
			if (user != null)
			{
				_unitOfWork.Repository<User>().Delete(user);
				await _unitOfWork.SaveAsync();
			}
		}

		// GET: api/users/notifications
		[HttpGet]
        [AccessTokenAuthorization]
        [Route("notifications")]
		public async Task<IHttpActionResult> GetGlobalNotifications()
		{
			var userId = GetCurrentUserId();
			var user = await _unitOfWork.Repository<User>().GetAsync(userId);
			if (user == null)
			{
				return NotFound();
			}
			return Ok(UserDetailsDto.FromModel(user).Notifications);
		}

		//PUT: api/users/notificatations/1
		[HttpPut]
        [AccessTokenAuthorization]
        public async Task<IHttpActionResult> EditGlobalNotifications(int id, bool notifications)
		{
			var user = await _unitOfWork.Repository<User>().FindAsync(n => n.Id == id);
			user.Notifications = notifications;
			return Ok(user);
		}

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				_unitOfWork.Dispose();
			}
			base.Dispose(disposing);
		}
	}
}
