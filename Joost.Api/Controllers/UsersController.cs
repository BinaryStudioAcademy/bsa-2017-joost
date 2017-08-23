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
    using System.Collections.Generic;

    [RoutePrefix("api/users")]
    public class UsersController : BaseApiController
    {
        public UsersController(IUnitOfWork unitOfWork) : base(unitOfWork)
        { }
        
        // GET: api/users/5
        [HttpGet]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            var user = await _unitOfWork.Repository<User>().GetAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(UserDetailsDto.FromModel(user));
        }
        
        // GET: api/users/check/{login}
        [HttpGet]
        [Route("check/{login}")]
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
                var newUser = new User { Email = user.Email, Password = user.Password, IsActived = false };
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
