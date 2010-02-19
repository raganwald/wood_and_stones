class Game < ActiveRecord::Base
  class InvalidInitialization < Exception
  end
  belongs_to(:current_board, :class_name => "Board", :foreign_key => "current_board_id")
  validates_presence_of(:current_board)
  belongs_to(:black, :class_name => "User", :foreign_key => "black_id")
  validates_presence_of(:black)
  validates_associated(:black)
  belongs_to(:white, :class_name => "User", :foreign_key => "white_id")
  validates_presence_of(:white)
  validates_associated(:white)
  has_many(:actions, :class_name => "Action::Base", :foreign_key => "game_id", :order => :cardinality)
  has_many(:boards, :through => :actions, :source => :after)
  has_many(:secrets, :as => :target)
  OPTIONS = [:handicap, :dimension, :fork, :b, :w]
  named_scope(:played_by, lambda do |user|
    { :conditions => (["black_id = ? OR white_id = ?", user.id, user.id]) }
  end)
  composed_of(:initial_board, :class_name => "Board", :mapping => ([["dimension", "dimension"], ["current_board_serialized", "as_str"]]))
  composed_of(:current_board, :class_name => "Board", :mapping => ([["dimension", "dimension"], ["current_board_serialized", "as_str"]]))
  validates_each(:initial_board, :current_board) do |record, attribute, value|
    Board.validate_for(record, attribute)
  end
  def user_to_play
    (it = self.to_play and self.send(it)) unless self.ended?
  end
  def user_to_play_id
    (colour = self.to_play and self.send("#{colour}_id")) unless self.ended?
  end
  def initialize(attributes)
    attributes ||= Hash.new
    options = OPTIONS.inject(Hash.new) do |h, attr|
      (h[attr] = attributes[attr] and attributes.delete(attr))
      h
    end
    super(attributes)
    if black_email = options[:b] then
      self.black ||= User.find_or_create_by_email(black_email)
    end
    if white_email = options[:w] then
      self.white ||= User.find_or_create_by_email(white_email)
    end
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
        handicap_amount = options[:handicap].to_i
        board = Board.new(dimension) do |nascent_board|
          nascent_board.handicap(it) if (handicap_amount > 1)
        end
        self.to_play = (handicap_amount > 1) ? (Board::WHITE_S) : (Board::BLACK_S)
        self.initial_board = self.current_board = board
        start
      else
        self.errors.add(:before, "cannot initialize a game without forking or setting a dimension")
      end
    end
  end
  def current_removed
    ((it = self.current_removed_serialized and eval(it)) or [])
  end
  def current_removed=(stones)
    self.current_removed_serialized = stones.inspect
  end
  def valid_positions
    return [] if self.ended?
    lambda do |valid_move_hashes|
      if (self.current_removed.size == 1) then
        valid_move_hashes.reject! do |its|
          ((its.location.to_a == self.current_removed.first.to_a) and (its.dead_stones.size == 1))
        end
      end
      valid_move_hashes
    end.call(self.current_board.legal_moves_for(self.to_play)).map(&:location)
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