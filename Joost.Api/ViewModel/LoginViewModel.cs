using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Joost.Api.ViewModel
{
    public class LoginViewModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}