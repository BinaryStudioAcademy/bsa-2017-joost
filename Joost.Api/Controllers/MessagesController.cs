using Joost.Api.Services;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using System.Web.Http;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Joost.Api.Controllers
{
    [RoutePrefix("api/messages")]
    public class MessagesController : BaseApiController
    {
        private IChatHubService _chatHubService;

        public MessagesController(IUnitOfWork unitOfWork, IChatHubService chatHubService) : base(unitOfWork)
        {
            _chatHubService = chatHubService;
        }

        [HttpGet]
        [Route("dialogs")]
        public async Task<IHttpActionResult> GetUsersDialogsWith(int take, int skip)
        {
            var userWithDialogs = await this._unitOfWork.Repository<Message>().AllAsync();
            return this.Ok(
                userWithDialogs
                    .Where(m => m.Receiver.Id == this.GetCurrentUserId() || m.Sender.Id == this.GetCurrentUserId())
                    .Aggregate(
                        new List<User>(),
                        (list, message) =>
                        {
                            if (message.Receiver.Id == this.GetCurrentUserId())
                            {
                                if (!list.Contains(message.Sender))
                                {
                                    list.Add(message.Sender);
                                }
                            }
                            else
                            {
                                if (!list.Contains(message.Receiver))
                                {
                                    list.Add(message.Receiver);
                                }
                            }
                            return list;
                        }));
        }

        [HttpGet]
        [Route("group-messages")]
        public async Task<IHttpActionResult> GetGroupsMessages(int groupId, int skip, int take)
        {
            var gropMessages = this._unitOfWork.Repository<GroupMessage>().Query().Include(m => m.Receiver).Include(m => m.Sender)
                ;
            return this.Ok(gropMessages.Where(gm => gm.Receiver.Id == groupId).Skip(skip).Take(take)
                .Select(m => new
                                 {
                                     SenderId = m.Sender.Id,
                                     m.Text,
                                     DateTime = m.CreatedAt,
                                     Image = m.Sender.Avatar,
                                 }));
        }

        [HttpGet]
        [Route("user-messages")]
        public async Task<IHttpActionResult> GetMessagesWith(int userId, int skip, int take)
        {
            var messagesWith = this._unitOfWork.Repository<Message>().Query().Include(m => m.Receiver).Include(m => m.Sender);
            var currentUserId = this.GetCurrentUserId();
            var queryable = messagesWith.Where(m => m.Sender.Id == currentUserId || m.Receiver.Id == currentUserId)
                .Where(m => m.Sender.Id == userId || m.Receiver.Id == userId).ToArray()
                .Skip(skip).Take(take)
                .Select(m => new
                                 {
                                     SenderId = m.Sender.Id,
                                     m.Text,
                                     DateTime = m.CreatedAt,
                                     Image = m.Sender.Avatar,
                                 });
            return this.Ok(queryable);
        }

        // POST: api/Messages
        [HttpPost]
        [Route("user-messages")]
        public async Task<IHttpActionResult> AddUserMessage([FromBody]Message message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _unitOfWork.Repository<Message>().Add(message);
            await _unitOfWork.SaveAsync();

            await _chatHubService.SendToUser(message.Sender.Id, message.Receiver.Id, message.Text);

            return Ok();
        }

        // POST: api/Messages
        [HttpPost]
        [Route("group-messages")]
        public async Task<IHttpActionResult> AddGroupMessage([FromBody]GroupMessage message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _unitOfWork.Repository<GroupMessage>().Add(message);
            await _unitOfWork.SaveAsync();

            await _chatHubService.SendToGroup(message.Sender.Id, message.Receiver.Id, message.Text);

            return Ok();
        }

        // PUT: api/Messages/5
        [HttpPut]
        [Route("user-messages")]
        public async Task<IHttpActionResult> EditUserMessage(int id, [FromBody]Message message)
        {
            _unitOfWork.Repository<Message>().Attach(message);
            await _unitOfWork.SaveAsync();

            return Ok(message);
        }

        // PUT: api/Messages/5
        [HttpPut]
        [Route("group-messages")]
        public async Task<IHttpActionResult> EditGroupMessage(int id, [FromBody]GroupMessage message)
        {
            _unitOfWork.Repository<GroupMessage>().Attach(message);
            await _unitOfWork.SaveAsync();

            return Ok(message);
        }

        // DELETE: api/Messages/5
        [HttpDelete]
        [Route("user-messages")]
        public async Task DeleteUserMessage(int id)
        {
            var message = await _unitOfWork.Repository<Message>().FindAsync(item => item.Id == id);
            if (message != null)
            {
                _unitOfWork.Repository<Message>().Delete(message);
                await _unitOfWork.SaveAsync();
            }
        }

        // DELETE: api/Messages/5
        [HttpDelete]
        [Route("group-messages")]
        public async Task DeleteGroupMessage(int id)
        {
            var message = await _unitOfWork.Repository<GroupMessage>().FindAsync(item => item.Id == id);
            if (message != null)
            {
                _unitOfWork.Repository<GroupMessage>().Delete(message);
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
