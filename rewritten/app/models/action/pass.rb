class Action::Pass < Action::Base
  after_create(:update_game_to_play)
  private
  def update_game_to_play
    self.game.update_attribute(:to_play, (self.player == Board::BLACK_S) ? (Board::WHITE_S) : (Board::BLACK_S))
    true
  end
end