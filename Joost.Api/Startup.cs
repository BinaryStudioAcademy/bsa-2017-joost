using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Joost.Api.Startup))]

namespace Joost.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
            app.MapSignalR();
        }
    }
}
