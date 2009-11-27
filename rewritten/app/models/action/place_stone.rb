class Action::PlaceStone < Action::Base
  validates_presence_of(:before, :on => :create, :message => "can't be blank")
  validates_presence_of(:after, :on => :create, :message => "can't be blank")
  validates_each(:position) do |record, attr, value|
    unless (__12593341122480__ = record.before and __12593341122480__.valid_position?(value)) then
      record.errors.add(attr, "should be of the form A1 and be a valid position on the board")
    end
  end
  validates_each(:after) do |record, attr, value|
    unless ((value and value.dimension) == (__125933411229328__ = record.before and __125933411229328__.dimension)) then
      record.errors.add(attr, "should be the same dimension as :before")
    end
  end
end