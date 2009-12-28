class Game < ActiveRecord::Base
  class InvalidInitialization < Exception
  end
  belongs_to(:current_board, :class_name => "Board", :foreign_key => "current_board_id")
  validates_presence_of(:current_board)
  validates_associated(:current_board)
  belongs_to(:black, :class_name => "User", :foreign_key => "black_id")
  validates_presence_of(:black)
  validates_associated(:black)
  belongs_to(:white, :class_name => "User", :foreign_key => "white_id")
  validates_presence_of(:white)
  validates_associated(:white)
  has_many(:actions, :class_name => "Action::Base", :foreign_key => "game_id", :order => :cardinality)
  has_many(:boards, :through => :actions, :source => :after)
  has_many(:secrets, :as => :target)
  OPTIONS = [:handicap, :dimension, :fork]
  named_scope(:played_by, lambda do |user|
    { :conditions => (["black_id = ? OR white_id = ?", user.id, user.id]) }
  end)
  def initial_board
    ((__126196363181378__ = self.actions.first and __126196363181378__.before) or self.current_board)
  end
  def initialize(attributes)
    attributes ||= Hash.new
    options = OPTIONS.inject(Hash.new) do |h, attr|
      (h[attr] = attributes[attr] and attributes.delete(attr))
      h
    end
    super(attributes)
    if forked = options[:fork] then
      self.current_board = if forked.kind_of?(Board) then
        forked
      else
        if forked.respond_to?(:current_board) then
          forked.current_board
        else
          self.errors.add(:before, "cannot initialize a game without forking or setting a dimension")
        end
      end
      fork
    else
      if dimension = options[:dimension] then
        self.current_board = Board.create(:dimension => (dimension))
        (handicap = options[:handicap].to_i
        if (handicap > 1) then
          self.current_board.handicap(handicap)
          self.current_board.save!
          self.to_play = Board::WHITE_S
        else
          self.to_play = Board::BLACK_S
        end)
        start
      else
        self.errors.add(:before, "cannot initialize a game without forking or setting a dimension")
      end
    end
  end
  state_machine do
    event(:start) { transition(nil => :started) }
    event(:fork) { transition(all => :forked) }
    event(:move) { transition((all - [:ended]) => :moved) }
    event(:pass) do
      transition((all - [:ended, :passed]) => :passed, :passed => :ended)
    end
    event(:resign) { transition(all => :ended) }
  end
end