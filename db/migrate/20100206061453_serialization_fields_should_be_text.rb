class SerializationFieldsShouldBeText < ActiveRecord::Migration
  
  def self.up
    change_column :games, :initial_board_serialized, :text
    change_column :games, :current_board_serialized, :text
    change_column :games, :current_removed_serialized, :text
    change_column :actions, :after_board_serialized, :text
    change_column :actions, :removed_serialized, :text
  end

  def self.down
    change_column :games, :initial_board_serialized, :string
    change_column :games, :current_board_serialized, :string
    change_column :games, :current_removed_serialized, :string
    change_column :actions, :after_board_serialized, :string
    change_column :actions, :removed_serialized, :string
  end
  
end
