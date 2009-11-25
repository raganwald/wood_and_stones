class CreateBoardTable < ActiveRecord::Migration
  def self.up
    create_table :boards, :force => true do |t|
      t.integer :prior_board_id
      t.integer :dimension
      t.timestamps
    end
  end

  def self.down
    drop_table :boards
  end
end
