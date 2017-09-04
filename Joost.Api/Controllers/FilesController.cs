﻿using Joost.Api.Infrastructure;
using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
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
        [Route("{fileName}")]
        public IHttpActionResult DownloadFile(string fileName)
        {
            string folderPath = HttpContext.Current.Server.MapPath("~/App_Data/AttachedFiles/");

			List<string> AllowedFileExtensions = new List<string> { ".jpg", ".gif", ".png", ".bmp" };

			var filePath = Directory.EnumerateFiles(folderPath, fileName + ".*", SearchOption.AllDirectories).FirstOrDefault();
            //.Where(s => s.EndsWith(".jpg") || s.EndsWith(".png") || s.EndsWith(".bmp") || s.EndsWith(".gif")).FirstOrDefault();

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
		public class MyFile
		{
			public string Name { get; set; }
		}

		[HttpPost]
		[Route("download")]
		public IHttpActionResult Download()
		{
			var fileName = HttpContext.Current.Request.Form["fileName"];
			string folderPath = HttpContext.Current.Server.MapPath("~/App_Data/AttachedFiles/");
			//List<string> AllowedFileExtensions = new List<string> { ".jpg", ".gif", ".png", ".bmp" };

			//var filePath = Directory.EnumerateFiles(folderPath, file.Name, SearchOption.AllDirectories).FirstOrDefault();
			//.Where(s => s.EndsWith(".jpg") || s.EndsWith(".png") || s.EndsWith(".bmp") || s.EndsWith(".gif")).FirstOrDefault();

			var filePath = folderPath + fileName;

			if (!File.Exists(filePath))
				return NotFound();

			var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
			var response = new HttpResponseMessage(HttpStatusCode.OK);
			response.Content = new StreamContent(stream);
			response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
			response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
			{
				FileName = fileName
			};

			return ResponseMessage(response);

			//try
			//{
			//	if (!String.IsNullOrWhiteSpace(filePath))
			//	{
			//		string fileType = filePath.Substring(filePath.LastIndexOf('.') + 1);
			//		//string mediaType = String.Format("application/{0}", fileType);
			//		string mediaType = "application/octet-stream";

			//		return new FileResult(filePath, mediaType);
			//	}
			//	else
			//	{
			//		return NotFound();
			//	}
			//}
			//catch (Exception ex)
			//{
			//	return InternalServerError();
			//}

		}

		// POST api/files/
		[HttpPost, HttpPut]
        [Route("")]
        public IHttpActionResult UploadFile()
        {
            var fileName = HttpContext.Current.Request.Form["fileName"];

            //List<string> AllowedFileExtensions = new List<string> { ".jpg", ".gif", ".png", ".bmp" };
            int MaxContentLength = 1024 * 1024 * 3;

            var httpRequest = HttpContext.Current.Request;

            try
            {
                foreach (string file in httpRequest.Files)
                {
                    HttpPostedFile postedFile = httpRequest.Files[file];

                    if (postedFile != null && postedFile.ContentLength > 0)
                    {
                        //var ext = postedFile.FileName.Substring(postedFile.FileName.LastIndexOf('.'));
                        //var extension = ext.ToLower();

                        //if (!AllowedFileExtensions.Contains(extension))
                        //{
                        //    return BadRequest(); // "Please Upload image of type .jpg,.gif,.png., ".bmp""
                        //}
                        //else
                        //{
                            if (postedFile.ContentLength > MaxContentLength)
                            {
                                return BadRequest(); // "Please Upload a file upto 2 mb."
                            }
                            else
                            {
								string dir = HttpContext.Current.Server.MapPath("~/App_Data/AttachedFiles");
								if (!Directory.Exists(dir))
									Directory.CreateDirectory(dir);

								string relativeFilePath = "~/App_Data/AttachedFiles/" + fileName;
                                var filePath = HttpContext.Current.Server.MapPath(relativeFilePath);
                                postedFile.SaveAs(filePath);

                                return Ok();
                            }
                        //}
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
