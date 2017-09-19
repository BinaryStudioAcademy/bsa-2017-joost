using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Joost.ChatBot.Commands
{
	public class CommandService : ICommandService
	{
		private List<IBotCommand> Commands { get; set; }

		public CommandService()
		{
			Commands = new List<IBotCommand>();
		}


		private IBotCommand FindCommand(string command)
		{
			foreach (var cmd in Commands)
			{
				if (cmd.GetCommand() == command)
					return cmd;
			}
			return null;
		}


		public async Task<string> Execute(string message)
		{
			var command = FindCommand(message.Split(' ')[0]);
			if (command != null)
				return await command.Execute(message.Split(' '));
			return null;
		}
	}
}