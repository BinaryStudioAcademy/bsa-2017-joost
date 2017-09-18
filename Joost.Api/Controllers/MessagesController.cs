using Joost.Api.Services;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using System.Web.Http;
using Joost.Api.Models;
using System.Net;
using Joost.Api.Filters;
using Joost.DbAccess.DAL;

namespace Joost.Api.Controllers
{
    [AccessTokenAuthorization]
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
        public async Task<IHttpActionResult> GetUserMessages(int receiverId, int skip, int take)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
			var currentUserId = GetCurrentUserId();
			var messages = await _messageService.GetUserMessages(currentUserId, receiverId, skip, take);
            return Ok(messages);
        }

        [HttpGet]
        [Route("group-messages")]
        public async Task<IHttpActionResult> GetGroupMessages(int receiverId, int skip, int take)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
			var currentUserId = GetCurrentUserId();
			var groupMessages = await _messageService.GetGroupMessages(currentUserId, receiverId, skip, take);
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
            var currentUserId = GetCurrentUserId();
			if (currentUserId == message.SenderId && !message.IsGroup)
			{
                await _messageService.AddUserMessage(message);    
                if (message.ReceiverId == _messageService.ChatBotIdInDb)
                {
                    var responseMessage = await _messageService.SendMessageToBot(message);
                    await _messageService.AddUserMessage(responseMessage);
				}
				return Ok();
			}
			else return StatusCode(HttpStatusCode.MethodNotAllowed);
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
            var currentUserId = GetCurrentUserId();
            if (currentUserId == message.SenderId && message.IsGroup)
            {
				await _messageService.AddGroupMessage(message);
				return Ok();
			}
            else return StatusCode(HttpStatusCode.MethodNotAllowed);
        }

        // PUT: api/Messages/5
        [HttpPut]
        [Route("user-messages")]
        public async Task<IHttpActionResult> EditUserMessage([FromBody]MessageDto message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
			var currentUserId = GetCurrentUserId();
			if (currentUserId == message.SenderId && !message.IsGroup)
			{
				var ok = await _messageService.EditUserMessage(message);
				if (ok) return Ok(message);
				else return StatusCode(HttpStatusCode.MethodNotAllowed);
			}
			else return StatusCode(HttpStatusCode.MethodNotAllowed);
		}

        // PUT: api/Messages/5
        [HttpPut]
        [Route("group-messages")]
        public async Task<IHttpActionResult> EditGroupMessage([FromBody]MessageDto message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
			var currentUserId = GetCurrentUserId();
			if (currentUserId == message.SenderId && message.IsGroup)
			{
				var ok = await _messageService.EditGroupMessage(message);
				return Ok(message);
			}
			else return StatusCode(HttpStatusCode.MethodNotAllowed);
		}

		// DELETE: api/Messages/5
		[HttpDelete]
        [Route("user-messages")]
        public async Task<IHttpActionResult> DeleteUserMessage(int messageId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
			var currentUserId = GetCurrentUserId();
			var ok = await _messageService.DeleteUserMessage(currentUserId, messageId);
            if (ok) return Ok();
			else return StatusCode(HttpStatusCode.MethodNotAllowed);
		}

		// DELETE: api/Messages/5
		[HttpDelete]
        [Route("group-messages")]
        public async Task<IHttpActionResult> DeleteGroupMessage(int groupMessageId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
			var currentUserId = GetCurrentUserId();
			var ok = await _messageService.DeleteGroupMessage(currentUserId, groupMessageId);
			if (ok) return Ok();
			else return StatusCode(HttpStatusCode.MethodNotAllowed);
        }
    }
}
