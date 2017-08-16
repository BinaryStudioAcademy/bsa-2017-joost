namespace Joost.DbAccess.Migrations
{
    using Joost.DbAccess.EF;
    using Joost.DbAccess.Entities;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<JoostDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(JoostDbContext context)
        {
            var users = new List<User>
            {
                new User { Email="andrewbulkovskiy@gmail.com", Password="password", FirstName="Andrew", LastName = "Bulkovskiy" , State = UserState.Online, Avatar = "1_avatar.jpg", IsActived = true },
                new User { Email="amateishchuk@gmail.com", Password="password", FirstName="Andrii", LastName = "Mateishchuk" , State = UserState.Online, IsActived = true },
                new User { Email="artyom@gmail.com", Password="password", FirstName="Artyom", LastName = "Moiseenko" , State = UserState.Online, IsActived = true },
                new User { Email="diana@gmail.com", Password="password", FirstName="Diana", LastName = "Kolisnichenko" , State = UserState.Online, IsActived = true },
                new User { Email="raingeragon@gmail.com", Password="password", FirstName="Ilya", LastName = "Khomenko" , State = UserState.Online, IsActived = true },
                new User { Email="legodov@gmail.com", Password="password", FirstName="Oleh", LastName = "Dovhan" , State = UserState.Online, IsActived = true },
                new User { Email="straber@ukr.net", Password="password", FirstName="Oleksandr", LastName = "Truba" , State = UserState.Online, IsActived = true },
                new User { Email="daria@gmail.com", Password="password", FirstName="Darina", LastName = "Korotkih" , State = UserState.Online, IsActived = true },
                new User { Email="rrational@gmail.com", Password="password", FirstName="Vasyl", LastName = "Barna" , State = UserState.Online, IsActived = true },
                new User { Email="vitaly@gmail.com", Password="admin", FirstName="Віталій", LastName = "Ільченко" , State = UserState.Online, IsActived = true }
            };
            users.ForEach(c => context.Users.Add(c));
            context.SaveChanges();
        }
    }
}
