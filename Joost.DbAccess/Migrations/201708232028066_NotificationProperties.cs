namespace Joost.DbAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NotificationProperties : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "Notifications", c => c.Boolean(nullable: false));
            AddColumn("dbo.Users", "User_Id", c => c.Int());
            CreateIndex("dbo.Users", "User_Id");
            AddForeignKey("dbo.Users", "User_Id", "dbo.Users", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "User_Id", "dbo.Users");
            DropIndex("dbo.Users", new[] { "User_Id" });
            DropColumn("dbo.Users", "User_Id");
            DropColumn("dbo.Users", "Notifications");
        }
    }
}
