module Action::UpdatesGameState
  def self.included(receiver)
    receiver.instance_eval do |foo|
      validates_each(:game) do |record, attr, value|
        unless value.send("can_#{record.class.name.demodulize.downcase}?") then
          record.errors.add(attr, "does not permit you to #{record.class.name.demodulize.downcase}")
        end
      end
      after_create(:update_game_state)
    end
  end
  def update_game_state
    self.game.send("#{self.class.name.demodulize.downcase}!")
    true
  end
end