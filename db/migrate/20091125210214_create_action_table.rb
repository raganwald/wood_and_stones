class CreateActionTable < ActiveRecord::Migration
  def self.up
    create_table :actions, :force => true do |t|
      t.string :type
      t.string :position
      t.string :player
      t.integer :before_id
      t.integer :after_id
      t.integer :game_id
      t.timestamps
    end
  end

  def self.down
    drop_table :actions
  end
end
