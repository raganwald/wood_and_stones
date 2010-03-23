class GameObserver < ActiveRecord::Observer
  def after_create(game)
    if game.valid? then
      Secret.create!(:user => (game.black), :target => (game))
      Secret.create!(:user => (game.white), :target => (game))
    end
  end
  def after_save(game)
    unless game.last_black_notification == game.last_action_updated_i &&  game.last_white_notification == game.last_action_updated_i
      Delayed::Job.enqueue(Job::GameNotification.new(game), 0, 1.minute.from_now) # TODO: Increase to five minutes
    end
  end
end