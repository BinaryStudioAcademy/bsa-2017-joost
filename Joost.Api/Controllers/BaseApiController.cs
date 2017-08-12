using Joost.Api.Infrastructure;
using Joost.DbAccess.Interfaces;
using System.Linq;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    public class BaseApiController : ApiController
    {
        protected readonly IUnitOfWork _unitOfWork;

        public BaseApiController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        protected int GetCurrentUserId()
        {
            var token = Encrypt.DecryptToken(Request.Headers.GetValues("Authorization").First());
            return token.UserId;
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
