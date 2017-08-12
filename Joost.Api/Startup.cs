using Joost.Api.Hubs;
using Joost.DbAccess.DAL;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

[assembly: OwinStartup(typeof(Joost.Api.Startup))]

namespace Joost.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            GlobalHost.DependencyResolver.Register(
                typeof(ChatHub),
                () => new ChatHub(new UnitOfWork()));
            app.UseCors(CorsOptions.AllowAll);
            app.MapSignalR();
        }
    }
}
