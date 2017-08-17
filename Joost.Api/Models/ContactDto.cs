﻿namespace Joost.Api.Models
{
    public class ContactDto
    {
        public int ContactId { get; set; }
        public ContactState State { get; set; }
    }
    public enum ContactState
    {
        New,
        Sent,
        Accept,
        Decline
    }
}