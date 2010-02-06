class Game < ActiveRecord::Base; end

class SetDefaultForCurrentMoveNumber < ActiveRecord::Migration
  def self.up
    change_column :games, :current_move_number, :integer, :default => 0
    Game.update_all('current_move_number = 0', 'current_move_number IS NULL')
  end

  def self.down
    change_column :games, :current_move_number, :integer
  end
end
