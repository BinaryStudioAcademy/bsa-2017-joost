using System.Linq;
using System.Web.Http;
using Joost.DbAccess.Interfaces;
using System.Threading.Tasks;
using Joost.Api.Models;
using Joost.DbAccess.Entities;
using Joost.Api.Filters;

namespace Joost.Api.Controllers
{
    [AccessTokenAuthorization]
    [RoutePrefix("api/contact")]
    public class ContactController : BaseApiController
    {
        public ContactController(IUnitOfWork unitOfWork) : base(unitOfWork)
        {}

        // Get: api/contacts
        [HttpGet]
        public async Task<IHttpActionResult> GetContact()
        {
            var userId = GetCurrentUserId();
            var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            var cont = user.Contacts.Select(t => new ContactDto() { ContactId = t.ContactUser.Id, State = (Models.ContactState)t.State }).ToList();
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
            }
            // retry when user decline offer
            else
            {
                user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id).State = DbAccess.Entities.ContactState.Sent;
            }
            contactUser.Contacts.Add(new Contact()
            {
                User = contactUser,
                ContactUser = user,
                State = DbAccess.Entities.ContactState.New,
            });
            await _unitOfWork.SaveAsync();

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

            var contact = user.Contacts.FirstOrDefault(u => u.ContactUser.Id == id);

            if (contact == null)
            {
                return NotFound();
            }
            user.Contacts.Remove(contact);

            await _unitOfWork.SaveAsync();
            return Ok();
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
                State = (Models.ContactState)t.State,
                Avatar = t.ContactUser.Avatar,
                Name = t.ContactUser.FirstName + " " + t.ContactUser.LastName,
                City = t.ContactUser.City
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
            user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id).State = DbAccess.Entities.ContactState.Accept;
            contactUser.Contacts.FirstOrDefault(t => t.ContactUser.Id == user.Id).State = DbAccess.Entities.ContactState.Accept;

            await _unitOfWork.SaveAsync();

            return Ok();
        }

        // Post: api/contacts/decline-contact
        [HttpPost]
        [Route("decline-contact")]
        public async Task<IHttpActionResult> DeclineContact([FromBody]ContactDto contact)
        {
            //var userId = GetCurrentUserId();
            //if (userId == contact.ContactId)
            //{
            //    return InternalServerError();
            //}
            //var user = await _unitOfWork.Repository<User>().GetAsync(userId);
            //if (user == null)
            //{
            //    return NotFound();
            //}
            //var contactUser = await _unitOfWork.Repository<User>().GetAsync(contact.ContactId);
            //if (contactUser == null)
            //{
            //    return NotFound();
            //}
            //user.Contacts.Remove(user.Contacts.FirstOrDefault(t => t.ContactUser.Id == contactUser.Id));
            //contactUser.Contacts.FirstOrDefault(t => t.ContactUser.Id == user.Id).State = DbAccess.Entities.ContactState.Decline;
            //await _unitOfWork.SaveAsync();

            //return Ok();

            if (GetCurrentUserId() == contact.ContactId)
                return InternalServerError();

            var contactEntry = await _unitOfWork.Repository<Contact>().FindAsync(
                c => c.User.Id == GetCurrentUserId() &&
                c.ContactUser.Id == contact.ContactId);

            if (contactEntry == null)
                return NotFound();

            contactEntry.State = DbAccess.Entities.ContactState.Decline;
            _unitOfWork.Repository<Contact>().Attach(contactEntry);
            await _unitOfWork.SaveAsync();

            return Ok();
        }                          
    }
}
