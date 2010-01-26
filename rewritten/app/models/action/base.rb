class Action::Base < ActiveRecord::Base
  set_table_name(:actions)
  belongs_to(:game)
  composed_of(:after, :class_name => "Board", :mapping => ([["after_board_serialized", "as_str"], ["dimension", "dimension"]]))
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