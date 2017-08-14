using Joost.DbAccess.EF;
using Joost.DbAccess.Interfaces;
using System.Data.Entity;
using System.Threading.Tasks;

namespace Joost.DbAccess.DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DbContext _dataContext = new JoostDbContext();
        
        public IRepository<T> Repository<T>() where T : class, IEntity
        {
            return new Repository<T>(_dataContext);
        }

        public void Save()
        {
            _dataContext.SaveChanges();
        }

        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }

        public void Dispose()
        {
            _dataContext.Dispose();
        }
    }
}
