using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Ninject;
using Joost.DbAccess.Interfaces;
using Joost.DbAccess.DAL;

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
        }
	}
}