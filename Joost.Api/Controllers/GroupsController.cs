using Joost.Api.Models;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using System.Web.Http;
using Joost.Api.Filters;
using Joost.Api.Services;

namespace Joost.Api.Controllers
{
    [AccessTokenAuthorization]
    public class GroupsController : BaseApiController
    {
		private IGroupService _groupService;

		public GroupsController(IUnitOfWork unitOfWork, IGroupService groupService) : base(unitOfWork)
        {
			_groupService = groupService;
		}

        //// GET: api/Groups/5
        //[HttpGet]
        //public async Task<IHttpActionResult> GetGroups()
        //{
        //    int userId = GetCurrentUserId();
        //    var groups = (await _unitOfWork.Repository<Group>().AllAsync()).Where(item => item.Members.Any(i => i.Id == userId));
        //    if (groups == null)
        //    {
        //        return NotFound();
        //    }
        //    return Ok(groups);
        //}

        // GET: api/Groups/5
        [HttpGet]
        public async Task<IHttpActionResult> GetGroups(string name)
        {
			var groups = await _groupService.GetUserGroups(name);

			if (groups == null)
            {
                return NotFound();
            }
            return Ok(groups);
        }

        // GET: api/Groups/5
        [HttpGet]
        public async Task<IHttpActionResult> GetGroup(int id)
        {
			var currentUserId = GetCurrentUserId();
			var group = await _groupService.GetUserGroupsById(currentUserId, id);
			if (group != null)
				return Ok(group);
			else
				return NotFound();
		}

		// GET: api/Groups/5/getMembers
		[HttpGet]
		[Route("api/groups/{id}/getMembers")]
		public async Task<IHttpActionResult> GetGroupMembers(int id)
		{
			var currentUserId = GetCurrentUserId();

			var members = _groupService.GetGroupMembers(currentUserId, id);
			if (members == null)
				return NotFound();
			else
				return Ok(members);
		}

		// POST: api/Groups
		[HttpPost]
        public async Task<IHttpActionResult> AddGroup([FromBody]GroupDto group)
        {
            if (!ModelState.IsValid)
                return BadRequest();
			await _groupService.AddGroup(GetCurrentUserId(), group);
            return Ok();
        }

        // PUT: api/Groups/5
        [HttpPut]
        public async Task<IHttpActionResult> EditGroup(int id, [FromBody]GroupDto group)
        {
            if (!ModelState.IsValid)
                return BadRequest();

			var editGroup = _groupService.EditGroup(GetCurrentUserId(), id, group);
			if (editGroup != null)
				return Ok(editGroup);
			else
				return NotFound();
        }

        // DELETE: api/Groups/5
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteGroup(int id)
        {
			var rez = await _groupService.DeleteGroup(GetCurrentUserId(), id);
			if (rez)
				return Ok();
			else
				return NotFound();
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
