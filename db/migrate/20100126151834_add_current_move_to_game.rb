class AddCurrentMoveToGame < ActiveRecord::Migration
  def self.up
    add_column :games, :current_move_number, :integer
    Game.all.each { |g| g.update_attribute(:current_move_number, g.actions.count) }
  end

  def self.down
    remove_column :games, :current_move_number
  end
end
