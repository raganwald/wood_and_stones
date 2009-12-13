class Game < ActiveRecord::Base
  class InvalidInitialization < Exception
  end
  belongs_to(:current_board, :class_name => "Board", :foreign_key => "current_board_id")
  validates_presence_of(:current_board)
  validates_associated(:current_board)
  belongs_to(:black, :class_name => "User", :foreign_key => "black_id")
  validates_presence_of(:black)
  belongs_to(:white, :class_name => "User", :foreign_key => "white_id")
  validates_presence_of(:white)
  has_many(:actions, :class_name => "Action::Base", :foreign_key => "game_id")
  has_many(:boards, :through => :actions, :source => :after)
  OPTIONS = [:handicap, :dimension, :fork]
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
          raise(Game::InvalidInitialization.new("Don't know what to do with a #{it.inspect}"))
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
        raise(Game::InvalidInitialization.new("cannot initialize a game without forking or setting a dimension"))
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