using Joost.DbAccess.Interfaces;
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
