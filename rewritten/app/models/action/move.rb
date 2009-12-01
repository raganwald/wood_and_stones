class Action::Move < Action::PlaceStone
  before_create(:remove_opponent_dead_stones)
  validates_each(:position) do |record, attr, value|
    if record.before then
      unless record.before[value].blank? then
        record.errors.add(attr, "should be to an empty position on the board")
      end
    end
  end
  private
  def remove_opponent_dead_stones
    raise("implement me!")
  end
end