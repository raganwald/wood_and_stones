class Action::Base < ActiveRecord::Base
  set_table_name(:actions)
  belongs_to(:game)
  belongs_to(:before, :class_name => "Board", :foreign_key => "before_id")
  belongs_to(:after, :class_name => "Board", :foreign_key => "after_id")
  validates_presence_of(:player, :on => :create, :message => "can't be blank")
  validates_inclusion_of(:player, :in => (["black", "white"]))
  validates_presence_of(:game, :on => :create, :message => "can't be blank")
  validates_associated(:game, :on => :create)
  validates_associated(:before, :on => :create)
  validates_uniqueness_of(:before_id, :scope => :game_id, :allow_nil => (true))
  validates_associated(:after, :on => :create)
  validates_uniqueness_of(:after_id, :scope => :game_id, :allow_nil => (true))
end