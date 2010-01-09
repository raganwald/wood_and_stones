class Action::Gameplay < Action::Base
  include(Action::PlayerAction)
  before_validation_on_create(:clone_game_board_to_before, :clone_before_to_after, :check_game_state)
  before_create(:update_game_current_board)
  after_create(:update_game_state, :update_game_to_play, :save_after_board)
  def check_game_state
    if self.game.send("can_#{self.class.name.demodulize.downcase}?") then
      return true
    end
    self.errors.add(:game, "does not permit you to #{self.class.name.demodulize.downcase}")
    false
  end
  def clone_game_board_to_before
    self.before ||= (__126306057540854__ = self.game and __126306057540854__.current_board)
    true
  end
  def clone_before_to_after
    self.after ||= (__126306057578598__ = self.before and __126306057578598__.clone)
    true
  end
  def update_game_current_board
    self.game.update_attribute(:current_board, self.after)
    true
  end
  def save_after_board
    self.after.save!
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