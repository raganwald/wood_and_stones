class Game < ActiveRecord::Base
  class InvalidInitialization < Exception
  end
  belongs_to(:current_board, :class_name => "Board", :foreign_key => "current_board_id")
  validates_presence_of(:current_board)
  validates_associated(:current_board)
  validates_exclusion_of(:state, :in => (["nascent"]), :message => "This game cannot be saved")
  def initialize(options = {  })
    options ||= {  }
    super()
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
        self.current_board = Board.initial(options)
        start
      else
        raise(Game::InvalidInitialization.new("cannot initialize a game without forking or setting a dimension"))
      end
    end
  end
  state_machine do
    event(:start) { transition(:to => :started) }
    event(:fork) { transition(:to => :forked) }
    event(:move) { transition(:from => ([:started, :moved]), :to => :moved) }
    event(:end) { transition(:from => ([:started, :moved]), :to => :ended) }
  end
end