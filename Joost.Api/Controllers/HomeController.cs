using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Joost.Api.Controllers
{    

	public class HomeController : Controller
	{
        // static ILog log = LogManager.GetLogger(typeof(HomeController));
		public ActionResult Index()
		{
			ViewBag.Title = "Home Page";

			return View();
		}
	}
}
