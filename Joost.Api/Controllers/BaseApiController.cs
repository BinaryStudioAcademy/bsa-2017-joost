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
            var header = Request.Headers.GetValues("Authorization").FirstOrDefault();
            if (string.IsNullOrEmpty(header)) return -1;
            else
            {
                var token = Encrypt.DecryptAccessToken(header);
                return token.AT_UserId;
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
