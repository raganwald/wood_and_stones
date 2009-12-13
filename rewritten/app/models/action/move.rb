class Action::Move < Action::Gameplay
  include(Action::PlaceStone)
  before_validation_on_create(:remove_opponent_dead_stones)
  validates_each(:after) do |move, attr, board|
    if move.game.boards.map(&:to_a).include?(board.to_a) then
      move.errors.add_to_base("You cannot recreate a position that has already occurred in this game")
    end
  end
  private
  def remove_opponent_dead_stones
    stones_to_remove = self.after.dead_stones[(self.player == Board::BLACK_S) ? (1) : (0)]
    stones_to_remove.each(&:remove)
    true
  end
end