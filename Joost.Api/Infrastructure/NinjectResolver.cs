using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Ninject;
using Joost.DbAccess.Interfaces;
using Joost.DbAccess.DAL;
using Joost.Api.Services;
using Joost.Api.ChatBot;

namespace WeatherApp.Infrastructure
{
	public class NinjectResolver : IDependencyResolver
	{
		private readonly IKernel kernel;

		public NinjectResolver(IKernel kernelParam)
		{
			kernel = kernelParam;
			AddBindings();
		}

		public IEnumerable<object> GetServices(Type serviceType)
		{
			return kernel.GetAll(serviceType);
		}

		public object GetService(Type serviceType)
		{
			return kernel.TryGet(serviceType);
		}

		private void AddBindings()
		{
            kernel.Bind<IUnitOfWork>().To<UnitOfWork>();
            kernel.Bind<IChatHubService>().To<ChatHubService>();
            kernel.Bind<IDialogDataService>().To<DialogDataService>();
            kernel.Bind<IMessageService>().To<MessageService>();
			kernel.Bind<IGroupService>().To<GroupService>();
			kernel.Bind<IBotService>().To<ChatBotService>();
        }
	}
}