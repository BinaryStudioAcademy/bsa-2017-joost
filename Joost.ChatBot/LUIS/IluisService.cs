using System.Threading.Tasks;

namespace Joost.ChatBot.LUIS
{
	public interface ILuisService
	{
		Task<LuisResult> QueryLuis(string Query);
	}
}
