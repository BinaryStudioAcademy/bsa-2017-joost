using Joost.Api.Services;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using System.Web.Http;
using Joost.Api.Models;
using System;

namespace Joost.Api.Controllers
{
    [RoutePrefix("api/messages")]
    public class MessagesController : BaseApiController
    {
        private IMessageService _messageService;

        public MessagesController(IMessageService messageService, IUnitOfWork unitOfWork) : base(unitOfWork)
        {
            _messageService = messageService;
        }

        [HttpGet]
        [Route("user-messages")]
        public async Task<IHttpActionResult> GetUserMessages(int userId, int skip, int take)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var messages = await _messageService.GetUserMessages(userId, skip, take);
            return Ok(messages);
        }

        [HttpGet]
        [Route("group-messages")]
        public async Task<IHttpActionResult> GetGroupMessages(int groupId, int skip, int take)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var groupMessages = await _messageService.GetGroupMessages(groupId, skip, take);
            return Ok(groupMessages);
        }

        // POST: api/Messages
        [HttpPost]
        [Route("user-messages")]
        public async Task<IHttpActionResult> AddUserMessage([FromBody]MessageDto message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _messageService.AddUserMessage(message);
            return Ok();
        }

        // POST: api/Messages
        [HttpPost]
        [Route("group-messages")]
        public async Task<IHttpActionResult> AddGroupMessage([FromBody]MessageDto message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _messageService.AddGroupMessage(message);
            return Ok();
        }

        // PUT: api/Messages/5
        [HttpPut]
        [Route("user-messages")]
        public async Task<IHttpActionResult> EditUserMessage(int messageId, DateTime editedTime, [FromBody]string text)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var message = await _messageService.EditGroupMessage(messageId, text, editedTime);
            return Ok(message);
        }

        // PUT: api/Messages/5
        [HttpPut]
        [Route("group-messages")]
        public async Task<IHttpActionResult> EditGroupMessage(int groupMessageId, DateTime editedTime, [FromBody]string text)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var groupMessage = await _messageService.EditGroupMessage(groupMessageId, text, editedTime);
            return Ok(groupMessage);
        }

        // DELETE: api/Messages/5
        [HttpDelete]
        [Route("user-messages")]
        public async Task DeleteUserMessage(int messageId)
        {
            await _messageService.DeleteUserMessage(messageId);
        }

        // DELETE: api/Messages/5
        [HttpDelete]
        [Route("group-messages")]
        public async Task DeleteGroupMessage(int groupMessageId)
        {
            await _messageService.DeleteGroupMessage(groupMessageId);
        }
    }
}
