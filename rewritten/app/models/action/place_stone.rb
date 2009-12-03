class Action::PlaceStone < Action::Base
  class Occupied < Exception
  end
  before_validation_on_create(:clone_before_to_after, :place_stone)
  validates_presence_of(:before, :on => :create, :message => "can't be blank")
  validates_presence_of(:after, :on => :create, :message => "can't be blank")
  validates_presence_of(:position, :on => :create, :message => "can't be blank")
  validates_each(:position) do |record, attr, value|
    if record.before then
      unless record.before.valid_position?(value) then
        record.errors.add(attr, "should be of the form aa and be a valid position on the board")
      end
      unless record.before[value].open? then
        record.errors.add(attr, "should be to an empty place on the board")
      end
    end
  end
  validates_each(:after) do |record, attr, value|
    if record.after then
      unless (value.dimension == (__125986555666150__ = record.before and __125986555666150__.dimension)) then
        record.errors.add(attr, "should be the same dimension as :before")
      end
      unless value[record.position].has?(record.player) then
        record.errors.add(attr, "should result in a stone placed on the board")
      end
    end
  end
  private
  def clone_before_to_after
    self.after ||= self.before.clone if self.before
  end
  def place_stone
    if (self.after and self.after[self.position].open?) then
      self.after[self.position] = self.player
    end
  end
end