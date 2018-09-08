using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
namespace WebApplication1.Models
{
    
    public class Common
    {
        public List<FormValues> FormValues { get; set; }
        public Email Email { get; set; }
    }
}