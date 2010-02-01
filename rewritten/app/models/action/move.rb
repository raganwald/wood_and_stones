class Action::Move < Action::Gameplay
  include(Action::PlaceStone)
  def removed
    ((it = self.removed_serialized and eval(it)) or [])
  end
  def removed=(stones)
    self.removed_serialized = stones.inspect
  end
  before_validation_on_create(:remove_opponent_dead_stones)
  after_create(:updated_captured_stones)
  private
  def remove_opponent_dead_stones
    self.after -= self.removed = self.after.dead_stones[(self.player == Board::BLACK_S) ? (1) : (0)]
    true
  end
  def updated_captured_stones
    captured_stones = self.removed
    if (captured_stones.size > 0) then
      Game.transaction do |variable|
        msg = (player == Board::BLACK_S) ? ("captured_blacks") : ("captured_whites")
        self.game.send("#{msg}=", (self.game.send(msg) + captured_stones.size))
        self.game.current_removed = captured_stones
        self.game.save!
      end
    end
    true
  end
end