class Action::PlaceStone < Action::Base
  class Occupied < Exception
  end
  before_create(:check_existence_of_before_board, :clone_before_to_after, :place_stone)
  validates_presence_of(:before, :on => :create, :message => "can't be blank")
  validates_presence_of(:after, :on => :create, :message => "can't be blank")
  validates_each(:position) do |record, attr, value|
    if record.before then
      unless record.before.valid_position?(value) then
        record.errors.add(attr, "should be of the form aa and be a valid position on the board")
      end
    end
    if record.after then
      unless (record.after[value] == record.player) then
        record.errors.add(attr, "should result in a stone placed on the board")
      end
    end
  end
  validates_each(:after) do |record, attr, value|
    unless ((value and value.dimension) == (__125961646912916__ = record.before and __125961646912916__.dimension)) then
      record.errors.add(attr, "should be the same dimension as :before")
    end
  end
  private
  def check_existence_of_before_board
    (not self.before.blank?)
  end
  def clone_before_to_after
    self.after ||= self.before.clone
  end
  def place_stone
    self.after[self.position] = self.player
  end
  def perform_place_stone_steps
    raise("implemented by subclass")
  end
end