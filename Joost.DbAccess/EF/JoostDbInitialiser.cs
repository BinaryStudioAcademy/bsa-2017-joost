using Joost.DbAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Joost.DbAccess.EF
{
    class JoostDbInitialiser : System.Data.Entity.DropCreateDatabaseIfModelChanges<JoostDbContext>
    {
        protected override void Seed(JoostDbContext context)
        {
            var users = new List<User>
            {
            new User {Email="andrewbulkovskiy", Password="admin", FirstName="Andrew", LastName = "Bulkovskiy" , State = UserState.Online },
            new User {Email="amateishchuk", Password="admin", FirstName="Andrii", LastName = "Mateishchuk" , State = UserState.Online },
            new User {Email="artyom", Password="admin", FirstName="Artyom", LastName = "Moiseenko" , State = UserState.Online },
            new User {Email="diana", Password="admin", FirstName="Diana", LastName = "Kolisnichenko" , State = UserState.Online },
            new User {Email="raingeragon", Password="admin", FirstName="Ilya", LastName = "Khomenko" , State = UserState.Online },
            new User {Email="legodov", Password="admin", FirstName="Oleh", LastName = "Dovhan" , State = UserState.Online },
            new User {Email="straber", Password="admin", FirstName="Oleksandr", LastName = "Truba" , State = UserState.Online },
            new User {Email="daria", Password="admin", FirstName="Darina", LastName = "Korotkih" , State = UserState.Online },
            new User {Email="rrational", Password="admin", FirstName="Vasyl", LastName = "Barna" , State = UserState.Online },
            new User {Email="vitaly", Password="admin", FirstName="Віталій", LastName = "Ільченко" , State = UserState.Online }
            };

            users.ForEach(c => context.Users.Add(c));
            context.SaveChanges();

        }
    }
}
