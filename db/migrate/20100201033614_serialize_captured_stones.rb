class SerializeCapturedStones < ActiveRecord::Migration
  def self.up
    remove_column :actions, :captured_stones
    add_column :actions, :removed_serialized, :string
    add_column :games, :current_removed_serialized, :string
  end

  def self.down
    remove_column :games, :current_removed_serialized
    remove_column :actions, :removed_serialized
    add_column :actions, :captured_stones, :integer,        :default => 0
  end
end
