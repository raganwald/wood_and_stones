class AddCapturedColumnToActions < ActiveRecord::Migration
  def self.up
    add_column :actions, :captured_stones, :integer, :default => 0
  end

  def self.down
    remove_column :actions, :captured_stones
  end
end
