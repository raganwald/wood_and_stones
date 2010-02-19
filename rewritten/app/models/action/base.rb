class Action::Base < ActiveRecord::Base
  set_table_name(:actions)
  belongs_to(:game)
  composed_of(:before, :class_name => "Board", :mapping => ([["dimension", "dimension"], ["before_board_serialized", "as_str"]]))
  composed_of(:after, :class_name => "Board", :mapping => ([["dimension", "dimension"], ["after_board_serialized", "as_str"]]))
  before_validation_on_create(:initialize_before_board)
  before_create(:update_game_current_board)
  after_create { |action| action.game.save! }
  def initialize_before_board
    self.before = self.game.current_board
  end
  def update_game_current_board
    self.game.current_board = self.after
    self.game.current_move_number = self.cardinality
    true
  end
  def after?
    (not self.after_board_serialized.blank?)
  end
  validates_presence_of(:player, :on => :create, :message => "can't be blank")
  validates_inclusion_of(:player, :in => (["black", "white"]))
  validates_presence_of(:game, :on => :create, :message => "can't be blank")
  validates_associated(:game, :on => :create)
  validates_each(:after) do |record, attribute, value|
    Board.validate_for(record, attribute)
  end
  acts_as_list(:column => :cardinality, :scope => :game)
  named_scope(:in_order, :order => :cardinality)
end