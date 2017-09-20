using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Joost.ChatBot.LUIS
{
    public class Intent
    {
        public string intent { get; set; }
        public double score { get; set; }
    }

    public class Resolution
    {
        public string value { get; set; }
    }

    public class Entity
    {
        public string entity { get; set; }
        public string type { get; set; }
        public double score { get; set; }
        public Resolution resolution { get; set; }
    }

    public class LuisResult
    {
        public string query { get; set; }
        public Intent topScoringIntent { get; set; }
        public IList<Intent> intents { get; set; }
        public IList<Entity> entities { get; set; }
    }

}