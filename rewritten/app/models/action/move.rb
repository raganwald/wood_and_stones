class Action::Move < Action::Gameplay
  before_validation_on_create(:place_stone)
  after_validation_on_create(:updated_captured_stones)
  validates_presence_of(:position, :on => :create, :message => "can't be blank")
  validates_each(:position) do |record, attr, value|
    unless record.before.valid_position?(value) then
      record.errors.add(attr, "should be of the form aa and be a valid position on the board")
    end
    unless record.before[value].open? then
      record.errors.add(attr, "should be to an empty place on the board")
    end
    unless (record.before.legal_moves_for(record.player).any? do |its|
      (its.location == record.location)
    end) then
      record.errors.add(attr, "is not a valid move")
    end
  end
  validates_each(:after) do |record, attr, value|
    if record.after then
      unless value[record.position].has?(record.player) then
        record.errors.add(attr, "should result in a stone placed on the board")
      end
    end
  end
  def location
    @location ||= (__12675926941852__ = self.position
    if __12675926941852__.kind_of?(String) then
      RewriteRails::ExtensionMethods::String.to_location(__12675926941852__)
    else
      __12675926941852__.to_location
    end)
  end
  def removed
    ((it = self.removed_serialized and eval(it)) or [])
  end
  private
  def removed=(stones)
    self.removed_serialized = stones.inspect
  end
  def place_stone
    (dead_stones = (__126759269389893__ = self.before.legal_moves_for(self.player).detect do |its|
      (its.location == self.location)
    end and __126759269389893__.dead_stones) and (self.removed = dead_stones
    self.after = Board.new(self.before) do |b|
      b[self.position] = self.player
      dead_stones.each { |across, down| b[across][down].remove }
    end
    true))
  end
  def updated_captured_stones
    captured_stones = removed
    if (captured_stones.size > 0) then
      msg = (player == Board::BLACK_S) ? ("captured_blacks") : ("captured_whites")
      self.game.send("#{msg}=", (self.game.send(msg) + captured_stones.size))
    end
    self.game.current_removed = captured_stones
    true
  end
end