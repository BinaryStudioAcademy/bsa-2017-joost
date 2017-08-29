namespace Joost.DbAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedSendingFilesFields : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.GroupMessages", "AttachedFile", c => c.String());
            AddColumn("dbo.Messages", "AttachedFile", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Messages", "AttachedFile");
            DropColumn("dbo.GroupMessages", "AttachedFile");
        }
    }
}
