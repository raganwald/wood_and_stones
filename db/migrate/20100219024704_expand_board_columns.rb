class ExpandBoardColumns < ActiveRecord::Migration
  def self.up
    change_column :games, :initial_board_serialized, :text, :limit => 3249
    change_column :games, :current_board_serialized, :text, :limit => 3249
    change_column :games, :current_removed_serialized, :text, :limit => 3249
    change_column :actions, :after_board_serialized, :text, :limit => 3249
  end

  def self.down
  end
end
