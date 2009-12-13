module Action::PlayerAction
  def self.included(receiver)
    receiver.instance_eval { alias_method_chain(:initialize, :player_update) }
  end
  def initialize_with_player_update(attributes)
    initialize_without_player_update(attributes)
    self.player ||= self.game.to_play
  end
end