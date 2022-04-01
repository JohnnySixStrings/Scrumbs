using DataAnnotationsExtensions;
using Microsoft.AspNetCore.SignalR;
using Scrumbs.Models;
using System.Text.Json;

namespace Scrumbs.SignalRGame;

public class SpeedHub : Hub
{
    public async Task PlayCard(string user, Card card) {
        Console.WriteLine(Context.ConnectionId);
        await Clients.AllExcept(Context.ConnectionId).SendAsync("MoveHandler", user, card, Context.ConnectionAborted);
    }
    public async Task NewGame()
    {
        var deck = NewDeck();
        var playerOneHand = deck.GetRange(0 , 5);
        var playerTwoHand = deck.GetRange(5, 5);
        await Clients.All.SendAsync("NewGame", new { PlayerOneHand = playerOneHand, PlayerTwoHand = playerTwoHand });
    }
    public async Task Test()
    {
        Console.WriteLine(Context.ConnectionId);
    }
    private static List<Card> NewDeck()
    {
        var cards = new List<Card>();
        for (int i = 1; i < 5; i++)
        {
            for (int j = 1; i < 14; i++)
            {
                cards.Add(new Card { SuiteNumber = j, House = (House)i, faceUp = false });
            }
        }
        return cards.OrderBy(a => Guid.NewGuid()).ToList();
    }
}
public class Card
{
    // Suite Suite { get; set; }
    [Min(1)]
    [Max(13)]
    public int SuiteNumber { get; set; }
    public House House { get; set; }
    public bool faceUp { get; set; }
}
public enum House
{
    Heart,
    Spade,
    Club,
    Diamond
}
public enum Suite
{
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
}
public class Game
{
    public string Name { get; set; }
    public IList<User> Players { get; set; }
    public IList<Card> OriginalDeck { get; set; }
} 
