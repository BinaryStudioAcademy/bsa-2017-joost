using Joost.Api.Services;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Joost.Api.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class MessagesController : BaseApiController
    {
        private IChatHubService _chatHubService;

        public MessagesController(IUnitOfWork unitOfWork, IChatHubService chatHubService) : base(unitOfWork)
        {
            _chatHubService = chatHubService;
        }

        // GET: api/Messages
        [HttpGet]
        public async Task<IHttpActionResult> GetUserMessages()
        {
            var messages = await _unitOfWork.Repository<Message>().AllAsync();
            if (messages == null)
            {
                return NotFound();
            }
            return Ok(messages);
        }

        // GET: api/Messages
        [HttpGet]
        public async Task<IHttpActionResult> GetGroupMessages()
        {
            var messages = await _unitOfWork.Repository<GroupMessage>().AllAsync();
            if (messages == null)
            {
                return NotFound();
            }
            return Ok(messages);
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

            return CreatedAtRoute("DefaultApi", new { id = message.Id }, message);
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

            return CreatedAtRoute("DefaultApi", new { id = message.Id }, message);
        }

        // PUT: api/Messages/5
        [HttpPut]
        public async Task<IHttpActionResult> EditMessage(int id, [FromBody]Message message)
        {
            _unitOfWork.Repository<Message>().Attach(message);
            await _unitOfWork.SaveAsync();

            return Ok(message);
        }

        // DELETE: api/Messages/5
        [HttpDelete]
        public async Task DeleteMessage(int id)
        {
            var message = await _unitOfWork.Repository<Message>().FindAsync(item => item.Id == id);
            if (message != null)
            {
                _unitOfWork.Repository<Message>().Delete(message);
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
