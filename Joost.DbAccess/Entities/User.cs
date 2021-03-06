﻿using Joost.DbAccess.Interfaces;
using System;
using System.Collections.Generic;

namespace Joost.DbAccess.Entities
{
    public class User : IEntity
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
        public string Status { get; set; }
        public string Avatar { get; set; }
        public UserState State { get; set; }
        public bool IsOnline { get; set; }
        public bool IsActived { get; set; }
        public bool NotificationsFromUsers { get; set; }
        public bool NotificationsFromGroups { get; set; }
        public bool Notifications { get; set; }

        public virtual ICollection<Group> MutedGroups { get; set; }
        public virtual ICollection<User> MutedUsers { get; set; }
        public virtual ICollection<Contact> Contacts { get; set; }
        public virtual ICollection<Group> Groups { get; set; }
        public virtual ConfirmRegistration ConfirmRegistration { get; set; }
        public string ConnectionId { get; set; }

        public User()
        {
            Contacts = new List<Contact>();
            Groups = new List<Group>();
        }
    }

    public enum UserState
    {
        Online,
        Busy,
        Inaccesible,
        Offline
    }

    public enum Gender
    {
        Male,
        Female
    }
}
