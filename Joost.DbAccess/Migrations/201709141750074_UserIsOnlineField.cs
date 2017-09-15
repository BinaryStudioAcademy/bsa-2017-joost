namespace Joost.DbAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UserIsOnlineField : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "IsOnline", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "IsOnline");
        }
    }
}
