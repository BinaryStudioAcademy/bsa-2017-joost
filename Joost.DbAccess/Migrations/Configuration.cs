namespace Joost.DbAccess.Migrations
{
    using Joost.DbAccess.EF;
    using Joost.DbAccess.Entities;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    using System;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<JoostDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(JoostDbContext context)
        {
			var chatBot = new User { FirstName = "Joost", LastName = "Bot", State = UserState.Online, Avatar = "1_avatar.png", IsActived = true };

			var users = new List<User>
            {
                new User { Email="andrewbulkovskiy@gmail.com", Password="password", FirstName="Andrew", LastName = "Bulkovskiy" , State = UserState.Online, Avatar = "2_avatar.jpg", IsActived = true },
                new User { Email="amateishchuk@gmail.com", Password="password", FirstName="Andrii", LastName = "Mateishchuk" , State = UserState.Online, IsActived = true },
                new User { Email="artyom@gmail.com", Password="password", FirstName="Artyom", LastName = "Moiseenko" , State = UserState.Online, Avatar = "4_avatar.jpg", IsActived = true },
                new User { Email="diana@gmail.com", Password="password", FirstName="Diana", LastName = "Kolisnichenko" , State = UserState.Online, Avatar = "5_avatar.jpg", IsActived = true },
                new User { Email="raingeragon@gmail.com", Password="password", FirstName="Ilya", LastName = "Khomenko" , State = UserState.Online, Avatar = "6_avatar.jpg", IsActived = true },
                new User { Email="legodov@gmail.com", Password="password", FirstName="Oleh", LastName = "Dovhan" , State = UserState.Online, Avatar = "7_avatar.jpg", IsActived = true },
                new User { Email="straber@ukr.net", Password="password", FirstName="Oleksandr", LastName = "Truba" , State = UserState.Online, Avatar = "8_avatar.jpg", IsActived = true },
                new User { Email="daria@gmail.com", Password="password", FirstName="Darina", LastName = "Korotkih" , State = UserState.Online, Avatar = "9_avatar.jpg", IsActived = true },
            };

            var vitaliy = new User { Email = "vitaly@gmail.com", Password = "admin", FirstName = "Віталій", LastName = "Ільченко", State = UserState.Online, IsActived = true };
            var vasyl = new User { Email = "rrational@gmail.com", Password = "password", FirstName = "Vasyl", LastName = "Barna", State = UserState.Online, IsActived = true };

            var user = new User
            {
                Email = "some@gmail.com",
                Password = "password",
                FirstName = "My",
                LastName = "Name",
                BirthDate = new System.DateTime(1990, 11, 10),
                City = "Kyiv",
                Country = "Ukraine",
                Gender = Gender.Male,
                IsActived = true,
                State = UserState.Online,
                Status = "I'm a robot"
            };

            if (!context.Users.Any())  // if table is empty
            {
				context.Users.Add(chatBot);
                users.ForEach(c => context.Users.Add(c));
                context.Users.Add(vitaliy);
                context.Users.Add(vasyl);
                context.Users.Add(user);

                context.SaveChanges();

                user.Contacts.Add(new Contact { State = ContactState.Accept, User = user, ContactUser = vitaliy });
                vitaliy.Contacts.Add(new Contact { State = ContactState.Accept, User = vitaliy, ContactUser = user });
                user.Contacts.Add(new Contact { State = ContactState.Accept, User = user, ContactUser = vasyl });
                vasyl.Contacts.Add(new Contact { State = ContactState.Accept, User = vasyl, ContactUser = user });

				users[5].Contacts.Add(new Contact { State = ContactState.Accept, User = users[5], ContactUser = chatBot });
				chatBot.Contacts.Add(new Contact { State = ContactState.Accept, User = chatBot, ContactUser = users[5] });

				users[5].Contacts.Add(new Contact { State = ContactState.Accept, User = users[5], ContactUser = users[3] });
                users[3].Contacts.Add(new Contact { State = ContactState.Accept, User = users[3], ContactUser = users[5] });
                users[5].Contacts.Add(new Contact { State = ContactState.Accept, User = users[5], ContactUser = users[6] });
                users[6].Contacts.Add(new Contact { State = ContactState.Accept, User = users[6], ContactUser = users[5] });
                users[5].Contacts.Add(new Contact { State = ContactState.Accept, User = users[5], ContactUser = users[0] });
                users[0].Contacts.Add(new Contact { State = ContactState.Accept, User = users[0], ContactUser = users[5] });

                context.SaveChanges();
            }


            var messages = new List<Message>
            {
                new Message { Sender = users[5], Receiver = users[3],
                    CreatedAt = new DateTime(2017, 8, 28, 1, 1, 1), Text = "Привіт)" },
                new Message { Sender = users[3], Receiver = users[5],
                    CreatedAt = new DateTime(2017, 8, 28, 1, 1, 2), Text = "Привіт!" },
                new Message { Sender = users[5], Receiver = users[3],
                    CreatedAt = new DateTime(2017, 8, 28, 2, 2, 2), Text = "Як справи?" },
                new Message { Sender = users[3], Receiver = users[5],
                    CreatedAt = new DateTime(2017, 8, 28, 3, 3, 4), Text = "Норма, а в тебе?" },
                new Message { Sender = users[5], Receiver = users[6],
                    CreatedAt = new DateTime(2017, 8, 28, 3, 3, 4), Text = "Хей!" },
                new Message { Sender = users[5], Receiver = users[0],
                    CreatedAt = new DateTime(2017, 8, 28, 3, 3, 4), Text = "Йо!" }
            };

            if (!context.Messages.Any())  // if table is empty
            {
                messages.ForEach(c => context.Messages.Add(c));
            }

            context.SaveChanges();
        }
    }
}
