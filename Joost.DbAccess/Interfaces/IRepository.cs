using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Joost.DbAccess.Interfaces
{
    public interface IRepository<T> where T : class, IEntity
    {
        IQueryable<T> Query();
        IEnumerable<T> All();
        Task<IEnumerable<T>> AllAsync();
        T Get(int id);
        Task<T> GetAsync(int id);
        T Find(Func<T, bool> predicate);
        Task<T> Find(Expression<Func<T, bool>> predicate);
        void Add(T entity);
        void AddRange(IEnumerable<T> entities);
        void Attach(T entity);
        void Delete(T entity);
        void DeleteRange(IEnumerable<T> entities);
    }
}
