class Action::Gameplay < Action::Base
  include(Action::PlayerAction)
  before_validation_on_create(:copy_game_to_after, :check_game_state)
  before_create(:update_game_current_board)
  after_create(:update_game_state, :update_game_to_play)
  def check_game_state
    if self.game.send("can_#{self.class.name.demodulize.downcase}?") then
      return true
    end
    self.errors.add(:game, "does not permit you to #{self.class.name.demodulize.downcase}")
    false
  end
  def copy_game_to_after
    unless self.after? then
      self.after = (__126590279255479__ = self.game and __126590279255479__.current_board).clone
    end
    true
  end
  def update_game_current_board
    self.game.update_attribute(:current_board, self.after)
    self.game.update_attribute(:current_move_number, self.cardinality)
    true
  end
  def update_game_state
    self.game.send("#{self.class.name.demodulize.downcase}!")
    true
  end
  def update_game_to_play
    self.game.update_attribute(:to_play, (self.player == Board::BLACK_S) ? (Board::WHITE_S) : (Board::BLACK_S))
    true
  end
end