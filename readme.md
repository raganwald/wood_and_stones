world of go
===

Go is "an ancient oriental board game for two players that is noted for being rich in strategy despite its simple rules." [I tried to learn Go](http://github.com/raganwald/homoiconic/blob/master/2009-10-20/high_anxiety.md#readme "High Anxiety") recently, and it was a rich and rewarding personal experience to struggle with my inability to play at even a novice level. received a lot of feedback about that post, including a nice comment from Dave Peck, who pointed me to his weekend projct, [Dave Peck's Go](http://github.com/davepeck/appengine-go "[Dave Peck's Go]").

The sense of adventure in finding things out can be experienced in many different ways. Learning to play less poorly is one way. Another is to write a game playing algorithm, something that has fascinated me since I wrote a [Maharajah and the Sepoys](http://en.wikipedia.org/wiki/Maharajah_and_the_Sepoys) playing game in BASIC back at St. Andrews' College in 1977. A third is to write a server that adjudicates play between two humans. This is clearly less difficult but still provides opportunities for creativity and expression, which is why it is a [favourite interview question](http://weblog.raganwald.com/2006/06/my-favourite-interview-question.html "My favourite interview question").

So, here is "World of Go," a pass and play local web application that adjudicates a game of Go between two players. This is an ongoing work, with both feature design, UX design, and software design changing on an almost daily basis. That is a long-winded way of saying that IMHO the code is nearly complete crap. It is as if you picked up an architect's sketch pad and looked at a page to find it covered with scribbles and cross-outs.

(This is written *specifically* for the iPhone/iPod Touch at this time. I also test it on OS X Safari. I have made no attempt to test it on any other OS or browser.)

**help with playing**

To start a new game, open [index.html][index]:

![Start][start]

If you want, you can give nicknames or email addresses for each player. If you don't, you will be "Black" and "white" respectively. Email addresses are used to fetch gravatar images only, there is no email notification at this time.

Choose a board size, handicap, and game to play. "Classic Go" is exactly what you think it is. The other options are why I had the stones to call this "World of Go." Click "play" and you can start your game.

![White to Play][white_to_play]

In direct violation of [The Design of Everyday Things](http://www.amazon.com/gp/product/0465067107?ie=UTF8&amp;tag=raganwald001-20&amp;linkCode=as2&amp;camp=1789&amp;creative=390957&amp;creativeASIN=0465067107 "Amazon.com: The Design of Everyday Things (9780465067107): Donald A. Norman: Books"), World of Go is an experiment with *removing* the visible affordances in the User Interface. I am trying to make as much as possible work with gestures like swiping the screen or drawing simple symbols.

When it's your turn to play, tap the intersection where you wish to play a stone. If your play kills any of your opponent's stones, they will fade from sight. If you like your play, pass the phone to your opponent and it's their turn. If you don't like your play, "scrub" the board by swiping rapidly from left to right to left three or more times. It will be your turn again and you can tap a different intersection. You can undo multiple times if you want.

To pass, draw an "X" using three continuous strokes of your finger:

![Pass Gesture][pass]

If it is the second pass, you will be asked to confirm that you wish to end the game. Yes, you can scrub to undo a pass. Once a game of classic go ends, it's up to you to figure out who won.

If you would like to see a history of the game, you move backwards in time by swiping from left to right. This is like moving the film so that the past becomes visible. Each swipe from left to right moves back one move. You can move forward in the history by swiping from right to left. Once you have returned to the current move, swiping right to left does nothing further.

**world of go**

The application is specifically written to support other games, most of which are documented on [Sensei's Go Varient Page][sgv], including:

* [One Eyed Go][oneeye]: In this game, suicide is never allowed, even if your play would otherwise capture stones. One consequence of this simplification of the rules is that a single eye is enough to make a group safe.
* [Atari Go][atari]: This game uses normal rules, however the winner is the first to capture an opponent's stone. Obviously, there are no Kos or snapbacks. There are other positional implications.
* [Gonnect][gonnect]: In this game, the winner is the first to connect either pair of opposite sides of the board with a single group.
* [Wild Fuskeki][wild]: This is a standard game, however the first three moves are randomly chosen for each player. Black can have up to six randomly placed handicap stones. Initial positions will never include dead stones, ataris, or stones placed in either of the two edge rows or columns.
* **White to Live**: Several variations on a theme of giving black an overwhelming advantage and white playing to make a safe group. Black wins by eliminating all of white's stones. [Corner Go][corner] gives black the first row and column. To forestall futile thought experiments, these stones are unkillable. This is corner invasion exercise. Larger boards give white a larger advantage, the reverse of the usual handicap style. The [Shape Game][shape] gives Black unkillable stones on the first row and column all the way around the board. Probably best on larger boards.
* **Unusual Setups**: A few other ways to set up the initial board, including [Influence Go][influence], where each player gets two opposing edges of the board, and [Dots Go][dots], where the initial position consists of stones on alternate intersections of the board. In all unusual setup games, the normal rules of Go apply and any stone can be captured.

Note: The application does not attempt to score games that are won on the basis of territory, nor does it adjudicate games that end with two passes. It's up to you to decide who won and by how much.

**code confessions, a/k/a estimating the WTFs per LOC**

This is my first [jQuery](http://jquery.com/ "jQuery: The Write Less, Do More, JavaScript Library") project, and it shows. I'm also using [jQTouch](http://www.jqtouch.com/), although I'm using less and less of it as I get more comfortable with Mobile Safari. I've picked up a few other jQuery plugins for things like gravatars and polling. I use my own [iGesture][igesture] for gestures like swipes and scrubs. I'm experimenting with [qtip](http://craigsworks.com/projects/qtip/ "qTip - The jQuery tooltip plugin  - Home") for displaying messages and having some trouble with it on iPhone, so we'll see how that goes.

**license terms**

(c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with the exception of specific files otherwise licensed. Other licenses apply only to the files where they appear. This may change in time, check back.

Exemptions include iGesture and Dragscrollable.

[igesture]: http://github.com/raganwald/iGesture
[index]: http://raganwald.github.com/go/index.html
[start]: http://raganwald.github.com/go/i/about/start.png
[white_to_play]: http://raganwald.github.com/go/i/about/white_to_play.png
[pass]: http://raganwald.github.com/go/i/about/pass.png
[oneeye]: http://senseis.xmp.net/?OneEyedGo
[atari]: http://senseis.xmp.net/?AtariGo
[gonnect]: http://senseis.xmp.net/?Gonnect
[sgv]: http://senseis.xmp.net/?GoVariant
[wild]: http://senseis.xmp.net/?WildFuseki
[corner]: http://senseis.xmp.net/?BiggestCorner
[shape]: http://senseis.xmp.net/?ShapeGameSolid
[influence]: http://senseis.xmp.net/?InfluenceGo
[dots]: http://senseis.xmp.net/?DotsGo