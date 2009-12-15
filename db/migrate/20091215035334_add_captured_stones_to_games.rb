class AddCapturedStonesToGames < ActiveRecord::Migration
  def self.up
    add_column :games, :captured_whites, :integer, :default => 0
    add_column :games, :captured_blacks, :integer, :default => 0
  end

  def self.down
    remove_column :games, :captured_blacks
    remove_column :games, :captured_whites
  end
end
