using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Joost.Api
{
	public static class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
            // Web API routes
            config.MapHttpAttributeRoutes();
            var cors = new EnableCorsAttribute("http://localhost:4200", "*", "*","*");
            config.EnableCors();
            //Json format for response
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("Text/html"));
            config.Routes.MapHttpRoute(
				name: "DefaultApi",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { id = RouteParameter.Optional }
			);
		}
	}
}
