namespace Joost.DbAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ConfirmRegistrations",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Key = c.String(),
                        DateOfRegistration = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Id)
                .Index(t => t.Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Email = c.String(),
                        Password = c.String(),
                        FirstName = c.String(),
                        LastName = c.String(),
                        City = c.String(),
                        Country = c.String(),
                        BirthDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        Gender = c.Int(nullable: false),
                        Status = c.String(),
                        Avatar = c.String(),
                        State = c.Int(nullable: false),
                        IsActived = c.Boolean(nullable: false),
                        ConnectionId = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Groups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        CreatedAt = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        LastMessageAt = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        GroupCreator_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.GroupCreator_Id)
                .Index(t => t.GroupCreator_Id);
            
            CreateTable(
                "dbo.GroupMessages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        CreatedAt = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        EditedAt = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        Receiver_Id = c.Int(),
                        Sender_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Groups", t => t.Receiver_Id)
                .ForeignKey("dbo.Users", t => t.Sender_Id)
                .Index(t => t.Receiver_Id)
                .Index(t => t.Sender_Id);
            
            CreateTable(
                "dbo.Messages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Text = c.String(),
                        CreatedAt = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        EditedAt = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        Receiver_Id = c.Int(),
                        Sender_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Receiver_Id)
                .ForeignKey("dbo.Users", t => t.Sender_Id)
                .Index(t => t.Receiver_Id)
                .Index(t => t.Sender_Id);
            
            CreateTable(
                "dbo.UserContactMapping",
                c => new
                    {
                        UserId = c.Int(nullable: false),
                        ContactId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.UserId, t.ContactId })
                .ForeignKey("dbo.Users", t => t.UserId)
                .ForeignKey("dbo.Users", t => t.ContactId)
                .Index(t => t.UserId)
                .Index(t => t.ContactId);
            
            CreateTable(
                "dbo.GroupUsers",
                c => new
                    {
                        Group_Id = c.Int(nullable: false),
                        User_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Group_Id, t.User_Id })
                .ForeignKey("dbo.Groups", t => t.Group_Id, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.Group_Id)
                .Index(t => t.User_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Messages", "Sender_Id", "dbo.Users");
            DropForeignKey("dbo.Messages", "Receiver_Id", "dbo.Users");
            DropForeignKey("dbo.GroupMessages", "Sender_Id", "dbo.Users");
            DropForeignKey("dbo.GroupMessages", "Receiver_Id", "dbo.Groups");
            DropForeignKey("dbo.ConfirmRegistrations", "Id", "dbo.Users");
            DropForeignKey("dbo.GroupUsers", "User_Id", "dbo.Users");
            DropForeignKey("dbo.GroupUsers", "Group_Id", "dbo.Groups");
            DropForeignKey("dbo.Groups", "GroupCreator_Id", "dbo.Users");
            DropForeignKey("dbo.UserContactMapping", "ContactId", "dbo.Users");
            DropForeignKey("dbo.UserContactMapping", "UserId", "dbo.Users");
            DropIndex("dbo.GroupUsers", new[] { "User_Id" });
            DropIndex("dbo.GroupUsers", new[] { "Group_Id" });
            DropIndex("dbo.UserContactMapping", new[] { "ContactId" });
            DropIndex("dbo.UserContactMapping", new[] { "UserId" });
            DropIndex("dbo.Messages", new[] { "Sender_Id" });
            DropIndex("dbo.Messages", new[] { "Receiver_Id" });
            DropIndex("dbo.GroupMessages", new[] { "Sender_Id" });
            DropIndex("dbo.GroupMessages", new[] { "Receiver_Id" });
            DropIndex("dbo.Groups", new[] { "GroupCreator_Id" });
            DropIndex("dbo.ConfirmRegistrations", new[] { "Id" });
            DropTable("dbo.GroupUsers");
            DropTable("dbo.UserContactMapping");
            DropTable("dbo.Messages");
            DropTable("dbo.GroupMessages");
            DropTable("dbo.Groups");
            DropTable("dbo.Users");
            DropTable("dbo.ConfirmRegistrations");
        }
    }
}
