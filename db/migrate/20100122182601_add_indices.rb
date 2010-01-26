class AddIndices < ActiveRecord::Migration
  def self.up
    add_index :actions, :id
    add_index :actions, [:game_id, :cardinality]
    
    add_index :games, :id
    
    add_index :secrets, :secret
    
    add_index :users, :id
  end

  def self.down
    remove_index :actions, :id
    remove_index :actions, [:game_id, :cardinality]
    
    remove_index :games, :id
    
    remove_index :secrets, :secret
    
    remove_index :users, :id
  end
end
