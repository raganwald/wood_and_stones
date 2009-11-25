class Board < ActiveRecord::Base
  belongs_to(:prior_board, :class_name => "Board", :foreign_key => "prior_board_id")
  has_many(:next_boards, :class_name => "Board", :foreign_key => "prior_board_id")
  validates_inclusion_of(:dimension, :in => ([9, 11, 13, 15, 17, 19, 21, 23, 25]))
  def self.initial(options = {  })
    self.new(options)
  end
end