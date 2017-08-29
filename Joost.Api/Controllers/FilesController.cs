using Joost.Api.Infrastructure;
using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Joost.Api.Controllers
{
    [RoutePrefix("api/files")]
    public class FilesController : BaseApiController
    {

        public FilesController(IUnitOfWork unitOfWork) : base(unitOfWork) { }

        // GET api/files/
        [HttpGet]
        [Route("")]
        [Route("{partialName}")]
        public IHttpActionResult DownloadImage(string partialName)
        {
            string folderPath = HttpContext.Current.Server.MapPath("~/App_Data/AttachedFiles/");

            var filePath = Directory.EnumerateFiles(folderPath, partialName + ".*", SearchOption.AllDirectories)
            .Where(s => s.EndsWith(".jpg") || s.EndsWith(".png") || s.EndsWith(".bmp") || s.EndsWith(".gif")).FirstOrDefault();

            try
            {
                if (!String.IsNullOrWhiteSpace(filePath))
                {
                    string fileType = filePath.Substring(filePath.LastIndexOf('.') + 1);
                    string mediaType = String.Format("image/{0}", fileType);

                    return new FileResult(filePath, mediaType);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }

        }

        // POST api/files/
        [HttpPost, HttpPut]
        [Route("")]
        public IHttpActionResult UploadImage()
        {
            var fileName = HttpContext.Current.Request.Form["fileName"];

            List<string> AllowedFileExtensions = new List<string> { ".jpg", ".gif", ".png", ".bmp" };
            int MaxContentLength = 1024 * 1024 * 4;

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
                            return BadRequest(); // "Please Upload image of type .jpg,.gif,.png., ".bmp""
                        }
                        else
                        {
                            if (postedFile.ContentLength > MaxContentLength)
                            {
                                return BadRequest(); // "Please Upload a file upto 2 mb."
                            }
                            else
                            {
                                string relativeFilePath = "~/App_Data/AttachedFiles/" + fileName + extension;
                                var filePath = HttpContext.Current.Server.MapPath(relativeFilePath);
                                postedFile.SaveAs(filePath);

                                return Ok();
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
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }
    }
}
