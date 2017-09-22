using System;
using Joost.ChatBot.Commands.Joke;
using Joost.ChatBot.LUIS;
using System.Collections.Generic;
using System.Threading.Tasks;
using Joost.ChatBot.Commands.Help;
using Joost.ChatBot.Commands.Weather;
using Joost.ChatBot.Commands.Translate;
using Joost.ChatBot.Commands.Cargo;

namespace Joost.ChatBot.Commands
{
    [Serializable]
    public class CommandService : ICommandService
    {
        private List<IBotCommand> Commands { get; set; }
        private ILuisService _luis;
        public CommandService(ILuisService luis)
        {
            _luis = luis;

            Commands = new List<IBotCommand>()
            {
                new GetWeatherCommand(),
                new TakeTheJokeCommand(),
                new TranslateCommand(),
				new CargoCommand()
            };
            var helpCmd = new HelpCommand(Commands);

            Commands.Add(helpCmd);
        }


        private IBotCommand FindCommand(string command)
        {
            foreach (var cmd in Commands)
            {
                var str = cmd.GetCommand();
                if (cmd.GetCommand() == command)
                    return cmd;
            }
            return null;
        }


        public async Task<string> Execute(string query)
        {
            try
            {
                var luis = await _luis.QueryLuis(query);

                var cmd = FindCommand(luis.topScoringIntent.intent);
                List<string> aParams = new List<string>();
                foreach (var entity in luis.entities)
                    aParams.Add(entity.entity);
				if(cmd != null)
				{
					var rez =  await cmd.ExecuteAsync(aParams.ToArray());
					if (rez != null)
						return rez;
					else
						return "Sorry, I can't understand you <img alt='🤔' class='emojioneemoji' src='https://cdnjs.cloudflare.com/ajax/libs/emojione/2.1.4/assets/png/1f914.png'>";
				}
				else
				{
					return "Sorry, I can't understand you <img alt='🤔' class='emojioneemoji' src='https://cdnjs.cloudflare.com/ajax/libs/emojione/2.1.4/assets/png/1f914.png'>";
				}

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}