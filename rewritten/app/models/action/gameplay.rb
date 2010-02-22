class Action::Gameplay < Action::Base
  include(Action::PlayerAction)
  before_validation_on_create(:set_player, :check_whether_this_is_a_valid_action_in_the_game)
  after_validation_on_create(:update_game_to_play)
  after_create(:update_game_state)
  def set_player
    self.player ||= self.game.to_play
  end
  def check_whether_this_is_a_valid_action_in_the_game
    if self.game.send("can_#{self.class.name.demodulize.downcase}?") then
      return true
    end
    self.errors.add(:game, "does not permit you to #{self.class.name.demodulize.downcase}")
    false
  end
  def update_game_state
    self.game.send("#{self.class.name.demodulize.downcase}!")
    true
  end
  def update_game_to_play
    self.game.to_play = (self.player == Board::BLACK_S) ? (Board::WHITE_S) : (Board::BLACK_S)
    true
  end
end