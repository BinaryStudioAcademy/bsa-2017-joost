using System;
using System.Threading.Tasks;

namespace Joost.DbAccess.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<T> Repository<T>() where T : class, IEntity;
        void Save();
        Task SaveAsync();
    }
}
