namespace Joost.DbAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedGroupAvatars : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Groups", "Avatar", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Groups", "Avatar");
        }
    }
}
