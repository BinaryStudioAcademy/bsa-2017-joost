using Joost.Api.Models;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Linq;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Http;
using Joost.Api.Filters;
using System.Web;
using System.IO;

namespace Joost.Api.Controllers
{
    [AccessTokenAuthorization]
    public class GroupsController : BaseApiController
    {
        public GroupsController(IUnitOfWork unitOfWork) : base(unitOfWork)
        { }

        // GET: api/Groups/5
        [HttpGet]
        public async Task<IHttpActionResult> GetGroups()
        {
            int userId = GetCurrentUserId();
            var groups = (await _unitOfWork.Repository<Group>().AllAsync()).Where(item => item.Members.Any(i => i.Id == userId));
            if (groups == null)
            {
                return NotFound();
            }
            return Ok(groups);
        }

        // GET: api/Groups/5
        [HttpGet]
        public IHttpActionResult GetGroups(string name)
        {
            var groups = _unitOfWork.Repository<Group>()
                .Query()
                .Where(item => item.Name.Contains(name))
                .ToList();
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
            var group = await _unitOfWork.Repository<Group>()
				.Query()
				.Include(g => g.Members)
				.SingleAsync(g => g.Id == id);
			var selectedMembersId = group.Members.Select(m => m.Id);
			if (group != null)
            {
				var ok = selectedMembersId.Contains(currentUserId);
				if (ok)
				{
					var groupDto = new GroupDto
					{
						Id = group.Id,
						Name = group.Name,
						Description = group.Description,
						SelectedMembersId = selectedMembersId.ToList(),
						Avatar = group.Avatar
					};
					return Ok(groupDto);
				}
				else return NotFound();
			}
            else
                return NotFound();                      
		}

		// GET: api/Groups/5/getMembers
		[HttpGet]
		[Route("api/groups/{id}/getMembers")]
		public async Task<IHttpActionResult> GetGroupMembers(int id)
		{
			var currentUserId = GetCurrentUserId();
			var group = await _unitOfWork.Repository<Group>()
				.Query()
				.Include(g => g.Members)
				.SingleAsync(g => g.Id == id);
			if (group != null)
			{
				var selectedMembersId = group.Members.Select(m => m.Id);
				var ok = selectedMembersId.Contains(currentUserId);
				if (ok)
				{
					return Ok(group.Members.Select(m => UserDetailsDto.FromModel(m)));
				}
				else return NotFound();
			}
			else return NotFound();
		}

		// POST: api/Groups
		[HttpPost]
        public async Task<IHttpActionResult> AddGroup([FromBody]GroupDto group)
        {
            if (!ModelState.IsValid)
                return BadRequest();

			var newGroup = new Group()
			{
				Name = group.Name,
				CreatedAt = DateTime.Now,
				Description = group.Description,
				GroupCreator = await _unitOfWork.Repository<User>().GetAsync(GetCurrentUserId()),
				Avatar = group.Avatar
            };

            foreach (var memberId in group.SelectedMembersId)
                newGroup.Members.Add(await _unitOfWork.Repository<User>().GetAsync(memberId));
			newGroup.Members.Add(newGroup.GroupCreator);

            _unitOfWork.Repository<Group>().Add(newGroup);
			await _unitOfWork.SaveAsync();

			var newGr = _unitOfWork.Repository<Group>().All().LastOrDefault();
			if (newGr.Avatar != "")
			{
				string folderPath = HttpContext.Current.Server.MapPath("~/App_Data/AttachedFiles/");

				var filePath = Directory.EnumerateFiles(folderPath, newGr.Avatar + ".*", SearchOption.AllDirectories)
				.Where(s => s.EndsWith(".jpg") || s.EndsWith(".png") || s.EndsWith(".bmp") || s.EndsWith(".gif")).FirstOrDefault();

				if (filePath != null)
				{
					string fileType = filePath.Substring(filePath.LastIndexOf('.') + 1);
					string destPath = HttpContext.Current.Server.MapPath("~/App_Data/Avatars/") + newGr.Id +"_g_avatar." + fileType;
					try
					{
						File.Delete(destPath);
						File.Move(filePath, destPath);
						newGr.Avatar = destPath.Substring(destPath.LastIndexOf('\\') + 1);
					}
					catch (Exception ex)
					{
						return InternalServerError();
					}
					_unitOfWork.Repository<Group>().Attach(newGr);
				}
			}
			await _unitOfWork.SaveAsync();
            return Ok();
        }

        // PUT: api/Groups/5
        [HttpPut]
        public async Task<IHttpActionResult> EditGroup(int id, [FromBody]GroupDto group)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var editGroup = await _unitOfWork.Repository<Group>().GetAsync(id);

            if (editGroup.GroupCreator.Id != GetCurrentUserId())
                return BadRequest();

            editGroup.Name = group.Name;
            editGroup.Description = group.Description;
            editGroup.Members.Clear();

            foreach (var memberId in group.SelectedMembersId)
                editGroup.Members.Add(await _unitOfWork.Repository<User>().GetAsync(memberId));

            _unitOfWork.Repository<Group>().Attach(editGroup);
            await _unitOfWork.SaveAsync();

            return Ok(group);
        }

        // DELETE: api/Groups/5
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteGroup(int id)
        {
            var group = await _unitOfWork.Repository<Group>().GetAsync(id);
            if (group != null)
            {
                if (group.GroupCreator.Id == GetCurrentUserId())
                {
                    _unitOfWork.Repository<Group>().Delete(group);
                    await _unitOfWork.SaveAsync();
                    return Ok();
                }
                else
                    return BadRequest();
            }
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
