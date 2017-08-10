using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    [RoutePrefix("api/users")]
    public class UsersController : BaseApiController
    {
        public UsersController(IUnitOfWork unitOfWork) : base(unitOfWork)
        { }

        // GET: api/users
        [HttpGet]
        public async Task<IHttpActionResult> GetUsers(string name)
        {
            var users = await _unitOfWork.Repository<User>().AllAsync();
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users.Where(item => item.FirstName.Contains(name) || item.LastName.Contains(name)));
        }

        // GET: api/users/5
        [HttpGet]
        public async Task<IHttpActionResult> GetUser(int id)
        {
            var user = await _unitOfWork.Repository<User>().GetAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
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
        public async Task<IHttpActionResult> AddUser([FromBody]User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _unitOfWork.Repository<User>().Add(user);
            await _unitOfWork.SaveAsync();

            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }

        // PUT: api/users/5
        [HttpPut]
        public async Task<IHttpActionResult> EditUser(int id, [FromBody]User user)
        {
            _unitOfWork.Repository<User>().Attach(user);
            await _unitOfWork.SaveAsync();

            return Ok(user);
        }

        // PUT: api/users/state/5
        [HttpPut]
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
        public async Task DeleteUser(int id)
        {
            var user = await _unitOfWork.Repository<User>().FindAsync(item => item.Id == id);
            if (user != null)
            {
                _unitOfWork.Repository<User>().Delete(user);
                await _unitOfWork.SaveAsync();
            }
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
