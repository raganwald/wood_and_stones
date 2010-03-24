class GameNotifier < ActionMailer::Base
  def game(game)
    return if game.last_action_updated_i.nil?
    unless (__126939960739471__ = game.last_black_notification and (__126939960739471__ >= game.last_action_updated_i)) then
      mail_to(game, game.black)
      game.update_attribute(:last_black_notification, game.last_action_updated_i)
    end
    unless (__126939960789877__ = game.last_white_notification and (__126939960789877__ >= game.last_action_updated_i)) then
      mail_to(game, game.white)
      game.update_attribute(:last_black_notification, game.last_action_updated_i)
    end
  end
  private
  def mail_to(game, user)
    Rails.logger.info("***** mailing an update about Game #{game.id} to #{user.email}")
    secret = Secret.first(:conditions => ({ :target_id => (game.id), :target_type => (game.class.name), :user_id => (user.id) }))
    if (game.black == user) then
      opponents_email = game.white.email
    else
      if (game.white == secret.user) then
        opponents_email = game.black.email
      else
        raise("mailing an update to someone we don't recognize")
      end
    end
    recipients(user.email)
    from("go@raganwald.com")
    subject("There has been an update")
    body(:secret => (secret.secret), :opponent_email => (opponents_email))
  end
end