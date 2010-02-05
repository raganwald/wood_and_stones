class GameObserver < ActiveRecord::Observer
  def after_create(game)
    if game.valid? then
      Secret.create!(:user => (game.black), :target => (game))
      Secret.create!(:user => (game.white), :target => (game))
    end
  end
end