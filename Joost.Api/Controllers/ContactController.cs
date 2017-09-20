using System.Linq;
using System.Web.Http;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using Joost.Api.Models;
using Joost.DbAccess.Entities;
using Joost.Api.Filters;
using Joost.Api.Services;
using System.Configuration;

namespace Joost.Api.Controllers
{
    [AccessTokenAuthorization]
    [RoutePrefix("api/contact")]
    public class ContactController : BaseApiController
    {
		private IChatHubService _chatHubService;

        public ContactController(IUnitOfWork unitOfWork, IChatHubService chatHubService) : base(unitOfWork)
        {
			_chatHubService = chatHubService;
		}

        // Get: api/contacts
        [HttpGet]
        public async Task<IHttpActionResult> GetContacts()
        {
            var userId = GetCurrentUserId();
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var cont = user.Contacts.Select(t => new ContactDto() { ContactId = t.ContactUser.Id, State = (ContactState)t.State }).ToList();
            return Ok(cont);
        }

		// Post: api/contacts
		[HttpPost]
        public async Task<IHttpActionResult> AddContact([FromBody]ContactDto contact)
        {
            var userId = GetCurrentUserId();
            if (userId == contact.ContactId)
            {
                return InternalServerError();
            }
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var contactUser = await _unitOfWork.Repository<User>().GetAsync(contact.ContactId);
            if (contactUser == null)
            {
                return NotFound();
            }
            // first send 
            if (user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id) == null)
            {
                user.Contacts.Add(new Contact()
                {
                    User = user,
                    ContactUser = contactUser,
                    State = DbAccess.Entities.ContactState.Sent,
                });
                contactUser.Contacts.Add(new Contact()
                {
                    User = contactUser,
                    ContactUser = user,
                    State = DbAccess.Entities.ContactState.New,
                });
            }
            // retry when user decline offer
            else
            {
                user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id).State = DbAccess.Entities.ContactState.Sent;
                contactUser.Contacts.FirstOrDefault(t => t.ContactUser.Id == userId).State = DbAccess.Entities.ContactState.New;
            }

			await _unitOfWork.SaveAsync();
			await _chatHubService.RunContactAction(userId, contact.ContactId, ContactState.New);

			return Ok();
        }

        // Delete: api/contacts
        [HttpDelete]
        public async Task<IHttpActionResult> DeleteContact(int id)
        {
            var userId = GetCurrentUserId();
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var contactUser = await _unitOfWork.Repository<User>().GetAsync(id);
            if (contactUser == null)
            {
                return NotFound();
            }

            user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id).State = DbAccess.Entities.ContactState.Canceled;
            contactUser.Contacts.FirstOrDefault(t => t.ContactUser.Id == user.Id).State = DbAccess.Entities.ContactState.Decline;
            await _unitOfWork.SaveAsync();
            await _chatHubService.RunContactAction(userId, contactUser.Id, ContactState.Sent);

            return Ok();
        }

		// Get: api/contacts/group
		[HttpGet]
		[Route("group")]
		public async Task<IHttpActionResult> GetContactsForGroup()
		{
			var userId = GetCurrentUserId();
			var user = await _unitOfWork.Repository<User>().GetAsync(userId);
			if (user == null)
			{
				return NotFound();
			}

			int chatBotIdInDb = int.Parse(ConfigurationManager.AppSettings["chatBotIdInDb"]);

			var cont = user.Contacts.Select(t => new UserContactDto
			{
				Id = t.ContactUser.Id,
				State = t.State,
				Avatar = t.ContactUser.Avatar,
				Name = t.ContactUser.FirstName + " " + t.ContactUser.LastName,
				City = t.ContactUser.City,
				UserState = t.ContactUser.State
			}).Where(t => t.Id != chatBotIdInDb).OrderBy(t => t.State).ToList();

			return Ok(cont);
		}
		// Get: api/contacts/contacts-detail
		[HttpGet]
        [Route("contacts-detail")]
        public async Task<IHttpActionResult> GetContactsWithDetail()
        {
            var userId = GetCurrentUserId();
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var cont = user.Contacts.Select(t => new UserContactDto
            {
                Id = t.ContactUser.Id,
                State = t.State,
                Avatar = t.ContactUser.Avatar,
                Name = t.ContactUser.FirstName + " " + t.ContactUser.LastName,
                City = t.ContactUser.City,
                UserState = t.ContactUser.State
            }).OrderBy(t => t.State).ToList();
            return Ok(cont);
        }

        // Post: api/contacts/confirm-contact
        [HttpPost]
        [Route("confirm-contact")]
        public async Task<IHttpActionResult> ConfirmContact([FromBody]ContactDto contact)
        {
            var userId = GetCurrentUserId();
            if (userId == contact.ContactId)
            {
                return InternalServerError();
            }
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var contactUser = await _unitOfWork.Repository<User>().GetAsync(contact.ContactId);
            if (contactUser == null)
            {
                return NotFound();
            }
            user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id).State = ContactState.Accept;
            contactUser.Contacts.FirstOrDefault(t => t.ContactUser.Id == user.Id).State = ContactState.Accept;

            await _unitOfWork.SaveAsync();
			await _chatHubService.RunContactAction(userId, contact.ContactId, ContactState.Accept);

			return Ok();
        }

        // Post: api/contacts/decline-contact
        [HttpPost]
        [Route("decline-contact")]
        public async Task<IHttpActionResult> DeclineContact([FromBody]ContactDto contact)
        {
            var userId = GetCurrentUserId();
            if (userId == contact.ContactId)
            {
                return InternalServerError();
            }
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var contactUser = await _unitOfWork.Repository<User>().GetAsync(contact.ContactId);
            if (contactUser == null)
            {
                return NotFound();
            }
            user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id).State = ContactState.Canceled;
            contactUser.Contacts.FirstOrDefault(t => t.ContactUser.Id == user.Id).State = ContactState.Decline;
            await _unitOfWork.SaveAsync();
			await _chatHubService.RunContactAction(userId, contact.ContactId, ContactState.Canceled);

			return Ok();
        }                          
    }
}
