using Joost.Api.Models;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    public class GroupsController : BaseApiController
    {
        public GroupsController(IUnitOfWork unitOfWork) : base(unitOfWork)
        { }

        // GET: api/Groups/5
        [HttpGet]
        public async Task<IHttpActionResult> GetGroups(int userId)
        {
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
            var group = await _unitOfWork.Repository<Group>().GetAsync(id);
            if (group == null)
                return NotFound();

            var currentUser = await _unitOfWork.Repository<User>().GetAsync(GetCurrentUserId());
            if (group.GroupCreator.Id != currentUser.Id)
                return BadRequest();

            var groupDto = new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                MembersId = group.Members.Select(m => m.Id).ToList(),
                ContactsId = group.GroupCreator.Contacts.Select(c => c.ContactUser.Id).ToList()
            };

            groupDto.ContactsId = groupDto.ContactsId.Except(groupDto.MembersId).ToList();
            return Ok(groupDto);
        }

        // POST: api/Groups
        [HttpPost]
        public async Task<IHttpActionResult> AddGroup([FromBody]GroupDto group)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var newGroup = new Group()
            {
                Name = group.Name,
                CreatedAt = DateTime.Now,
                Description = group.Description,
                GroupCreator = await _unitOfWork.Repository<User>().GetAsync(GetCurrentUserId())
            };

            foreach (var memberId in group.MembersId)
                newGroup.Members.Add(await _unitOfWork.Repository<User>().GetAsync(memberId));

            _unitOfWork.Repository<Group>().Add(newGroup);
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
            var currentUser = await _unitOfWork.Repository<User>().GetAsync(GetCurrentUserId());

            if (editGroup.GroupCreator.Id != currentUser.Id)
                return BadRequest();

            editGroup.Name = group.Name;
            editGroup.Description = group.Description;
            editGroup.Members.Clear();

            foreach (var memberId in group.MembersId)
            {
                editGroup.Members.Add(await _unitOfWork.Repository<User>().GetAsync(memberId));
            }

            _unitOfWork.Repository<Group>().Attach(editGroup);
            await _unitOfWork.SaveAsync();

            return Ok(group);
        }

        // DELETE: api/Groups/5
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteGroup(int id)
        {
            var group = await _unitOfWork.Repository<Group>().GetAsync(id);
            var currentUser = await _unitOfWork.Repository<User>().GetAsync(GetCurrentUserId());
            if (group != null)
            {
                if (group.GroupCreator.Id == currentUser.Id)
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
