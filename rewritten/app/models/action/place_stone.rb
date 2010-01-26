module Action::PlaceStone
  def self.included(receiver)
    receiver.instance_eval do |foo|
      before_validation_on_create(:place_stone)
      validates_presence_of(:position, :on => :create, :message => "can't be blank")
      validates_each(:position) do |record, attr, value|
        if record.game.current_board then
          unless record.game.current_board.valid_position?(value) then
            record.errors.add(attr, "should be of the form aa and be a valid position on the board")
          end
          unless record.game.current_board[value].open? then
            record.errors.add(attr, "should be to an empty place on the board")
          end
        end
      end
      validates_each(:after) do |record, attr, value|
        if record.after then
          unless value[record.position].has?(record.player) then
            record.errors.add(attr, "should result in a stone placed on the board")
          end
        end
      end
    end
  end
  def place_stone
    if (self.after? and self.after[self.position].open?) then
      self.after = lambda do |board|
        board[self.position] = self.player
        board
      end.call(self.after.dup)
    end
  end
end