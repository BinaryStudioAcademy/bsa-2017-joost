using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    public class MessagesController : BaseApiController
    {
        public MessagesController(IUnitOfWork unitOfWork) : base(unitOfWork)
        { }

        // GET: api/Messages
        [HttpGet]
        public async Task<IHttpActionResult> GetMessages()
        {
            var messages = await _unitOfWork.Repository<Message>().AllAsync();
            if (messages == null)
            {
                return NotFound();
            }
            return Ok(messages);
        }

        // POST: api/Messages
        [HttpPost]
        public async Task<IHttpActionResult> AddMessage([FromBody]Message message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _unitOfWork.Repository<Message>().Add(message);
            await _unitOfWork.SaveAsync();

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
