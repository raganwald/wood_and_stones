class SecretMailer < ActionMailer::Base
  def game(secret)
    opponent_email = (game = secret.target
    if (game.black == secret.user) then
      game.white.email
    else
      if (game.white == secret.user) then
        game.black.email
      else
        raise("sharing a secret with someone we don't recognize")
      end
    end)
    recipients(secret.user.email)
    from("go@raganwald.com")
    subject("You have been invited to play a game of Go")
    body(:secret => (secret.secret), :opponent_email => (opponent_email))
  end
end