

using System.Threading.Tasks;

namespace Joost.Api.ChatBot.BotCommands
{
	public interface IBotCommand
	{
		string GetCommand();
		string GetDescription();
		Task<string> Execute(string[] parameters);

	}
}