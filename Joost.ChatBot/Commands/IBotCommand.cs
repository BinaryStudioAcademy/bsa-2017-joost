using System.Threading.Tasks;

namespace Joost.ChatBot.Commands
{
	public interface IBotCommand
	{
		string GetCommand();
		string GetDescription();
		Task<string> Execute(string[] parameters);
	}
}
