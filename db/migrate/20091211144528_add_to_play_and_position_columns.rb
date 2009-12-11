class AddToPlayAndPositionColumns < ActiveRecord::Migration
  def self.up
    add_column :games, :to_play, :string
    add_column :actions, :cardinality, :integer
  end

  def self.down
    remove_column :actions, :cardinality rescue nil
    remove_column :games, :to_play
  end
end
