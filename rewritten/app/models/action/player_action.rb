module Action::PlayerAction
  def self.included(receiver)
    receiver.instance_eval do
      after_create(:update_game_to_play)
      alias_method_chain(:initialize, :player_update)
    end
  end
  def initialize_with_player_update(attributes)
    initialize_without_player_update(attributes)
    self.player ||= self.game.to_play
  end
  def update_game_to_play
    self.game.update_attribute(:to_play, (self.player == Board::BLACK_S) ? (Board::WHITE_S) : (Board::BLACK_S))
    true
  end
end