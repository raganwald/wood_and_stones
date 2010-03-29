go
===

Go is "an ancient oriental board game for two players that is noted for being rich in strategy despite its simple rules." [I tried to learn Go](http://github.com/raganwald/homoiconic/blob/master/2009-10-20/high_anxiety.md#readme "High Anxiety") recently, and it was a rich and rewarding personal experience to struggle with my inability to play at even a novice level. Once I was okay with losing at the game, I lost a lot of interest in playing it. Odd, but I guess winning means a great deal to me in games!

The sense of adventure in finding things out can be experienced in many different ways. Learning to play less poorly is one way. Another is to write a game playing algorithm, something that has fascinated me since I wrote a [Maharajah and the Sepoys](http://en.wikipedia.org/wiki/Maharajah_and_the_Sepoys) playing game in BASIC back at St. Andrews' College in 1977. A third is to write a server that adjudicates play between two humans. This is clearly less difficult but still provides opportunities for creativity and expression, which is why it is a [favourite interview question](http://weblog.raganwald.com/2006/06/my-favourite-interview-question.html "My favourite interview question").

So, here is a web server that adjudicates a game of Go between two players. This is an ongoing work, with both feature design, UX design, and software design changing on an almost daily basis. That is a long-winded way of saying that IMHO the code is nearly complete crap. It is as if you picked up an architect's sketch pad and looked at a page to find it covered with scribbles and cross-outs.

The current approach is lifted directly from [Dave Peck's Go](http://go.davepeck.org/ "[Dave Peck's Go]"). When you create a new game, you supply an email for each player and are mailed a "secret" URL. Using that URL allows you to play the game without signing in, typing a password, &c. If you play more than one game, you need more than one URL.

**help with the server**

Configure `config/environments/production.rb` with whatever you need to run the Rails server and to run ActiveMailer. Run the rails server to host games and run [delayed\_job](http://github.com/tobi/delayed_job "Delayed Job") with `rake jobs:work` to actually send notification emails. 

**help with the client**

The web client is written *specifically* for the iPhone/iPod Touch at this time. I also test it on OS X Safari. I have made no attempt to test it on any other OS or browser. To start a new game, go to the web server's root, e.g. `http://localhost:3000`. Put your email and your opponent's email in, choose a board size, colour to play, and a handicap. 9x9 looks fine on an iPhone, but that's up to you. You and your opponents should receive emails with game invitations. Click the link in the email and you can play.

When it's your turn to play, tap the intersection where you wish to play a stone. If your play kills any of your opponent's stones, they will fade from sight. If you wish to make a different play, simply tap another intersection. When you are satisfied with your choice, swipe the board from right to left. This is called moving forwards in time. If you don't place a stone, moving forwards in time is a pass. You can 'undo' a placed stone by tapping it again.

If it's your opponent's turn to play, you can update the board whenever you like by moving forwards in time (swiping from right to left). If your opponent has moved or passed the board will be updated. I am experimenting with various mechanisms for automatically polling for an update.

If you would like to see a history of the game, you move backwards in time by swiping from left to right. Each swipe from left to right moves back one move. You can move forward a move by swiping from right to left. Once you have returned to the current move, swiping right to left is once again either making a play or updating.

There's a bit more, but this should get you started until I add a little more to the documentation.

**code confessions, a/k/a estimating the WTFs per LOC**

This is my first [jQuery](http://jquery.com/ "jQuery: The Write Less, Do More, JavaScript Library") project, and it shows. I'm also using [jQTouch](http://www.jqtouch.com/), although I'm using less and less of it as I get more comfortable with Mobile Safari. I've picked up a few other jQuery plugins for things like gravatars and polling. Right now I'm playing with [jGesture](http://plugins.jquery.com/project/jGesture) to support a gestural UX. I've modified it to work on Mobile Safari and to support a custom event architecture instead of a callback architecture. jQTouch handles swiping left and right, but I wanted a richer set of gestures for more advanced users. I'm experimenting with [qtip](http://craigsworks.com/projects/qtip/ "qTip - The jQuery tooltip plugin  - Home") for displaying messages and having some trouble with it on iPhone, so we'll see how that goes.

Embarrassingly, I thought supporting SGF was overly complicated and I should stick to simple page generation, but I've ended up re-inventing it in JSON format. What can I say, vote for [issue #108](https://github.com/raganwald/go/issues/#issue/108)!

**license terms**

The MIT License

Copyright (c) 2010 Reginald Braithwaite

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.