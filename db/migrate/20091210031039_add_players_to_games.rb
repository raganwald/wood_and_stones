class AddPlayersToGames < ActiveRecord::Migration
  def self.up
    add_column :games, :black_id, :integer
    add_column :games, :white_id, :integer
  end

  def self.down
    remove_column :games, :white_id
    remove_column :games, :black_id
  end
end
