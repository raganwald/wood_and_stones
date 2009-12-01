class CreateBoardTable < ActiveRecord::Migration
  def self.up
    create_table :boards, :force => true do |t|
      t.integer :dimension
      t.string  :sgf_hack, :null => false, :default => ''
      t.timestamps
    end
  end

  def self.down
    drop_table :boards
  end
end
