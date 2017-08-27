namespace Joost.DbAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNotificationsPropertiesFromUsersAndGroups : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "NotificationsFromUsers", c => c.Boolean(nullable: false));
            AddColumn("dbo.Users", "NotificationsFromGroups", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "NotificationsFromGroups");
            DropColumn("dbo.Users", "NotificationsFromUsers");
        }
    }
}
