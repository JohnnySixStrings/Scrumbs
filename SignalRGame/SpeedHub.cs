using DataAnnotationsExtensions;
using Microsoft.AspNetCore.SignalR;
using Scrumbs.Models;
using System.Text.Json;

namespace Scrumbs.SignalRGame;

public class SpeedHub : Hub
{
    private PlayersContext playerData;

    public SpeedHub(PlayersContext data)
    {
        playerData = data;
    }

    public async Task PlayCard(string user, Card card) {
        Console.WriteLine(Context.ConnectionId);
        await Clients.AllExcept(Context.ConnectionId).SendAsync("MoveHandler", user, card, Context.ConnectionAborted);
    }
    public async Task NewGame()
    {
        Console.WriteLine(Context.ConnectionId);

        var deck = NewDeck();
        var playerOneHand = deck.GetRange(0 , 5);
        var playerTwoHand = deck.GetRange(5, 5);
        var continueL = deck.GetRange(10,5);
        var continueR = deck.GetRange(15,5);
        var playerOneStack = deck.GetRange(20, 15);
        var playerTwoStack = deck.GetRange(35, 15);
        var playL = deck.GetRange(50, 1);
        var playR = deck.GetRange(51, 1);

        await Clients.All.SendAsync("NewGame", new { PlayerOneHand = playerOneHand, PlayerTwoHand = playerTwoHand , ContinueL = continueL, ContinueR = continueR, PlayerOneStack = playerOneStack, PlayerTwoStack = playerTwoStack, PlayL = playL, PlayR = playR, players = playerData.players}, Context.ConnectionAborted);
    }
    public async Task NewUser(string UserName)
    {
        var connenctions = playerData.players.Select(p => p.ConnectionId).ToList();
        
        if(connenctions.Contains(Context.ConnectionId)){
            playerData.players[connenctions.IndexOf(Context.ConnectionId)].UserName = UserName;
        } else {
            playerData.players.Add(new User{UserName = UserName, ConnectionId = Context.ConnectionId});
        }
    }

    private static List<Card> NewDeck()
    {
        var cards = new List<Card>();
        for (int i = 1; i < 5; i++)
        {
            for (int j = 1; j < 14; j++)
            {
                cards.Add(new Card { SuiteNumber = j, House = (House)i, FaceUp = false });
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
    public bool FaceUp { get; set; }
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
