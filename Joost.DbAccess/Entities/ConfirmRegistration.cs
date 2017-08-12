using Joost.DbAccess.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Joost.DbAccess.Entities
{
    public class ConfirmRegistration : IEntity
    {
        [Key]
        [ForeignKey("User")]
        public int Id { get; set; }
        public string Key { get; set; }
        public DateTime DateOfRegistration { get; set; }
        public virtual User User { get; set; }
    }
}
