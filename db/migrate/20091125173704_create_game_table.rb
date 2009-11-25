class CreateGameTable < ActiveRecord::Migration
  def self.up
    create_table :games, :force => true do |t|
      t.string :state
      t.timestamps
    end
    add_column :games, :current_board_id, :integer
  end

  def self.down
    remove_column :games, :current_board_id
    drop_table :games
  end
end
