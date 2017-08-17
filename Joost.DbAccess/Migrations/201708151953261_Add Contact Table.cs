namespace Joost.DbAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddContactTable : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.UserContactMapping", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserContactMapping", "ContactId", "dbo.Users");
            DropIndex("dbo.UserContactMapping", new[] { "UserId" });
            DropIndex("dbo.UserContactMapping", new[] { "ContactId" });
            CreateTable(
                "dbo.Contacts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        State = c.Int(nullable: false),
                        ContactUser_Id = c.Int(nullable: false),
                        User_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.ContactUser_Id)
                .ForeignKey("dbo.Users", t => t.User_Id)
                .Index(t => t.ContactUser_Id)
                .Index(t => t.User_Id);
            
            DropTable("dbo.UserContactMapping");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.UserContactMapping",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        ContactId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.UserId, t.ContactId });
            
            DropForeignKey("dbo.Contacts", "User_Id", "dbo.Users");
            DropForeignKey("dbo.Contacts", "ContactUser_Id", "dbo.Users");
            DropIndex("dbo.Contacts", new[] { "User_Id" });
            DropIndex("dbo.Contacts", new[] { "ContactUser_Id" });
            DropTable("dbo.Contacts");
            CreateIndex("dbo.UserContactMapping", "ContactId");
            CreateIndex("dbo.UserContactMapping", "UserId");
            AddForeignKey("dbo.UserContactMapping", "ContactId", "dbo.Users", "Id");
            AddForeignKey("dbo.UserContactMapping", "UserId", "dbo.Users", "Id");
        }
    }
}
