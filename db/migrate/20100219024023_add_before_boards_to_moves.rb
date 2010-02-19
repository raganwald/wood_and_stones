class AddBeforeBoardsToMoves < ActiveRecord::Migration
  def self.up
    add_column :actions, :before_board_serialized, :text, :limit => 3249
  end

  def self.down
    remove_column :actions, :before_board_serialized
  end
end
