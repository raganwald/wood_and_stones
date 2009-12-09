class Action::PlaceStone < Action::Base
  before_validation_on_create(:clone_game_board_to_before, :clone_before_to_after, :place_stone)
  before_create(:update_game_current_board)
  after_create(:save_after_board)
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
      unless (value.dimension == (__126039275941749__ = record.before and __126039275941749__.dimension)) then
        record.errors.add(attr, "should be the same dimension as :before")
      end
      unless value[record.position].has?(record.player) then
        record.errors.add(attr, "should result in a stone placed on the board")
      end
    end
  end
  private
  def clone_game_board_to_before
    self.before ||= (__126039275970326__ = self.game and __126039275970326__.current_board)
  end
  def clone_before_to_after
    self.after ||= (__126039275956936__ = self.before and __126039275956936__.clone)
  end
  def update_game_current_board
    self.game.update_attribute(:current_board, self.after)
  end
  def save_after_board
    self.after.save!
  end
  def place_stone
    if (self.after and self.after[self.position].open?) then
      self.after[self.position] = self.player
    end
  end
end