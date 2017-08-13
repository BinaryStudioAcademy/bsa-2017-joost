using Joost.DbAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Joost.DbAccess.EF
{
    public class JoostDbInitialiser : System.Data.Entity.DropCreateDatabaseIfModelChanges<JoostDbContext>
    {
        protected override void Seed(JoostDbContext context)
        {
            var users = new List<User>
            {
            new User {Email="andrewbulkovskiy@gmail.com", Password="password", FirstName="Andrew", LastName = "Bulkovskiy" , State = UserState.Online },
            new User {Email="amateishchuk@gmail.com", Password="password", FirstName="Andrii", LastName = "Mateishchuk" , State = UserState.Online },
            new User {Email="artyom@gmail.com", Password="password", FirstName="Artyom", LastName = "Moiseenko" , State = UserState.Online },
            new User {Email="diana@gmail.com", Password="password", FirstName="Diana", LastName = "Kolisnichenko" , State = UserState.Online },
            new User {Email="raingeragon@gmail.com", Password="password", FirstName="Ilya", LastName = "Khomenko" , State = UserState.Online },
            new User {Email="legodov@gmail.com", Password="password", FirstName="Oleh", LastName = "Dovhan" , State = UserState.Online },
            new User {Email="straber@ukr.net", Password="password", FirstName="Oleksandr", LastName = "Truba" , State = UserState.Online, IsActived = true },
            new User {Email="daria@gmail.com", Password="password", FirstName="Darina", LastName = "Korotkih" , State = UserState.Online, IsActived = true },
            new User {Email="rrational@gmail.com", Password="password", FirstName="Vasyl", LastName = "Barna" , State = UserState.Online, IsActived = true },
            new User {Email="vitaly@gmail.com", Password="admin", FirstName="Віталій", LastName = "Ільченко" , State = UserState.Online, IsActived = true }
            };

            users.ForEach(c => context.Users.Add(c));
            context.SaveChanges();

        }
    }
}
