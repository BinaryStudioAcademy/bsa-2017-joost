using System;
using System.Collections.Generic;
using Ninject;
using System.Web.Mvc;
using Joost.ChatBot.Commands.Weather.Services;
using Joost.ChatBot.Commands.Weather.Converters;
using Joost.ChatBot.LUIS;
using Joost.ChatBot.Commands;

namespace Joost.ChatBot.Infrastructure
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
			kernel.Bind<IWeatherService>().To<OpenWeatherMapService>();
			kernel.Bind<IApiResponseConverter>().To<JsonResponseConverter>();
			kernel.Bind<ILuisService>().To<LuisService>().InThreadScope();
			kernel.Bind<ICommandService>().To<CommandService>().InThreadScope();
		}
	}
}