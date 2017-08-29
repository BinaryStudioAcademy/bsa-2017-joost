using System.Linq;
using System.Web.Http;
using System.Threading.Tasks;
using Joost.DbAccess.Interfaces;
using Joost.Api.Services;

namespace Joost.Api.Controllers
{
    [RoutePrefix("api/dialogs")]
    public class DialogsController : BaseApiController
    {
        private IDialogDataService _dialogService;

        public DialogsController(IUnitOfWork unitOfWork, IDialogDataService dialogService): base(unitOfWork)
        {
            _dialogService = dialogService;
        }

        // GET: api/dialogs
        [HttpGet]
        public async Task<IHttpActionResult> GetDialogs()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentUserId = GetCurrentUserId();
            var userDialogs = await _dialogService.GetUserDialogsData(currentUserId);
            var groupDialogs = await _dialogService.GetGroupDialogsData(currentUserId);
            var allDialogs = userDialogs.Union(groupDialogs);
            return Ok(allDialogs);
        }
    }
}
