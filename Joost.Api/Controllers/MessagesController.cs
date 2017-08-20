using Joost.Api.Services;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.InteropServices;

    using Joost.Api.Models;

    public class MessagesController : BaseApiController
    {
        private IChatHubService _chatHubService;

        public MessagesController(IUnitOfWork unitOfWork, IChatHubService chatHubService) : base(unitOfWork)
        {
            _chatHubService = chatHubService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetGroupsMessages(int groupId, int skip, int take)
        {
            var gropMessages = await this._unitOfWork.Repository<GroupMessage>().AllAsync();
            return this.Ok(gropMessages.Where(gm => gm.Sender.Id == groupId).Skip(skip).Take(take));
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetMessagesWith(int userId, int skip, int take)
        {
            var messagesWith = await this._unitOfWork.Repository<Message>().AllAsync();
            return this.Ok(
                messagesWith
                    .Where(m => m.Sender.Id == this.GetCurrentUserId() || m.Receiver.Id == this.GetCurrentUserId())
                    .Where(m => m.Sender.Id == userId || m.Receiver.Id == userId));
        }

        // POST: api/Messages
        [HttpPost]
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
        public async Task<IHttpActionResult> EditUserMessage(int id, [FromBody]Message message)
        {
            _unitOfWork.Repository<Message>().Attach(message);
            await _unitOfWork.SaveAsync();

            return Ok(message);
        }

        // PUT: api/Messages/5
        [HttpPut]
        public async Task<IHttpActionResult> EditGroupMessage(int id, [FromBody]GroupMessage message)
        {
            _unitOfWork.Repository<GroupMessage>().Attach(message);
            await _unitOfWork.SaveAsync();

            return Ok(message);
        }

        // DELETE: api/Messages/5
        [HttpDelete]
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
