go
===

Go is "an ancient oriental board game for two players that is noted for being rich in strategy despite its simple rules." [I tried to learn Go](http://github.com/raganwald/homoiconic/blob/master/2009-10-20/high_anxiety.md#readme "High Anxiety") recently, and it was a rich and rewarding personal experience to struggle with my inability to play at even a novice level. Once I was okay with losing at the game, I lost a lot of interest in playing it. Odd, but I guess winning means a great deal to me in games!

The sense of adventure in finding things out can be experienced in many different ways. Learning to play less poorly is one way. Another is to write a game playing algorithm, something that has fascinated me since I wrote a [Maharajah and the Sepoys](http://en.wikipedia.org/wiki/Maharajah_and_the_Sepoys) playing game in BASIC back at St. Andrews' College in 1977. A third is to write a server that adjudicates play between two humans. This is clearly less difficult but still provides opportunities for creativity and expression, which is why it is a [favourite interview question](http://weblog.raganwald.com/2006/06/my-favourite-interview-question.html "My favourite interview question").

So, here is a web server that adjudicates a game of Go between two players. This is an ongoing work, with both feature design, UX design, and software design changing on an almost daily basis. That is a long-winded way of saying that IMHO the code isnearly complete crap. It is as if you picked up an architect's sketch pad and looked at a page to find it covered with scribbles and cross-outs.

The current approach is lifted directly from [Dave Peck's Go](http://go.davepeck.org/ "[Dave Peck's Go]"). When you create a new game, you supply an email for each player and are mailed a "secret" URL. Using that URL allows you to play the game without signing in, typing a password, &c. If you play more than one game, you need more than one URL.

**help with the server**

You need to run the Rails server and also to run DelayedJob with `rake jobs:work`.