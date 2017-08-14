using Joost.DbAccess.Entities;
using System;
using System.Data.Entity;

namespace Joost.DbAccess.EF
{
    public class JoostDbContext: DbContext
    {
        public JoostDbContext() : base("JoostDB") { }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<GroupMessage> GroupMessages { get; set; }
        public DbSet<ConfirmRegistration> ConfirmRegistration { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
               .HasMany(g => g.Contacts)
               .WithMany()
               .Map(x =>
               {
                   x.MapLeftKey("UserId");
                   x.MapRightKey("ContactId");
                   x.ToTable("UserContactMapping");
               });

            modelBuilder.Entity<Group>()
                .HasMany(g => g.Members)
                .WithMany(m => m.Groups);

            modelBuilder.Properties<DateTime>().Configure(c => c.HasColumnType("datetime2"));
            base.OnModelCreating(modelBuilder);
        }
    }
}
