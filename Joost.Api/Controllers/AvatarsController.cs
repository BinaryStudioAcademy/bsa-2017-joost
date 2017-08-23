using Joost.Api.Infrastructure;
using Joost.DbAccess.Entities;
using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    public class AvatarsController : BaseApiController //TODO: move all the logic to AvatarsService.cs
    {
        public AvatarsController(IUnitOfWork unitOfWork) : base(unitOfWork) { }

        // GET api/avatars/5
        [HttpGet]
        public async Task<IHttpActionResult> GetAvatar()
        {
            int id = GetCurrentUserId();
            try
            {
                User user = await _unitOfWork.Repository<User>().FindAsync(item => item.Id == id);

                if (user != null)
                {
                    if (!String.IsNullOrWhiteSpace(user.Avatar))
                    {
                        string filePath = HttpContext.Current.Server.MapPath("~/App_Data/Avatars/" + user.Avatar);
                        if (File.Exists(filePath))
                        {
                            string fileType = user.Avatar.Substring(user.Avatar.LastIndexOf('.') + 1);
                            string mediaType = String.Format("image/{0}", fileType);

                            return new FileResult(filePath, mediaType);
                        }
                        else
                        {
                            return NotFound(); // File not found
                        }

                    }
                    else
                    {
                        return NotFound(); // will apply default image on client side
                    }
                }
                else
                {
                    return BadRequest(); // user not found
                }
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }

        }

        // POST api/avatars/5
        [HttpPost, HttpPut] // AND PUT?
        public async Task<IHttpActionResult> SetAvatar()
        {
            int id = GetCurrentUserId();
            List<string> AllowedFileExtensions = new List<string> { ".jpg", ".gif", ".png" };
            int MaxContentLength = 1024 * 1024 * 1; // 1 MB  

            var httpRequest = HttpContext.Current.Request;

            try
            {
                foreach (string file in httpRequest.Files)
                {
                    HttpPostedFile postedFile = httpRequest.Files[file];

                    if (postedFile != null && postedFile.ContentLength > 0)
                    {
                        var ext = postedFile.FileName.Substring(postedFile.FileName.LastIndexOf('.'));
                        var extension = ext.ToLower();

                        if (!AllowedFileExtensions.Contains(extension))
                        {
                            return BadRequest(); // "Please Upload image of type .jpg,.gif,.png."
                        }
                        else
                        {
                            if (postedFile.ContentLength > MaxContentLength)
                            {
                                return BadRequest(); // "Please Upload a file upto 1 mb."
                            }
                            else
                            {
                                var user = await _unitOfWork.Repository<User>().FindAsync(item => item.Id == id);
                                if (user != null)
                                {
                                    _unitOfWork.Repository<User>().Attach(user);
                                    user.Avatar = String.Format("{0}_avatar{1}", id, extension);

                                    var filePath = HttpContext.Current.Server.MapPath("~/App_Data/Avatars/" + id + "_avatar" + extension);

                                    await _unitOfWork.SaveAsync();
                                    postedFile.SaveAs(filePath);

                                    return Ok();
                                }
                                else
                                {
                                    return BadRequest();
                                }
                            }
                        }
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                return BadRequest(); // "Please Upload a file"
            }
            catch (Exception)
            {
                return InternalServerError();
            }

        }
    }
}
