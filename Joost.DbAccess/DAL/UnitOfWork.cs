using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Joost.DbAccess.DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DbContext _dataContext;

        public UnitOfWork(DbContext dataContext)
        {
            _dataContext = dataContext;
        }

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
