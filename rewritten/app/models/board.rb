class Board
  attr_accessor(:as_str)
  attr_accessor(:dimension)
  DIMENSIONS = [9, 11, 13, 15, 17, 19]
  BLACK_S, WHITE_S = "black", "white"
  class Occupied < Exception
  end
  class Wtf < Exception
  end
  class Placement
    attr_reader(:across, :down)
    def initialize(across_or_position, down = nil)
      if (across_or_position.kind_of?(Integer) and down.kind_of?(Integer)) then
        @across, @down = across_or_position, down
      else
        if down.nil? then
          @across, @down = across_or_position.scan(/[abcdefghijklmnopqrst]/i).map do |its|
            Board::LETTERS.index(its.upcase)
          end
        end
      end
    end
  end
  class Black < Placement
    def colour
      "black"
    end
  end
  class White < Placement
    def colour
      "white"
    end
  end
  module BlacksAndWhites
    def self.for(*arr)
      returning(arr) { arr.extend(self) }
    end
    def blacks
      self.first
    end
    def whites
      self.last
    end
    def all
      (self.first + self.last)
    end
    def map
      BlacksAndWhites.for(yield(blacks), yield(whites))
    end
  end
  module Location
    attr_accessor(:board)
    def self.for(board, across, down)
      lambda do |it|
        it.extend(self)
        it.board = board
        it
      end.call([across, down])
    end
    def across
      self.first
    end
    def down
      self.last
    end
    def open?
      self.board.to_a[self.across][self.down].blank?
    end
    def black?
      self.has?(BLACK_S)
    end
    def white?
      self.has?(WHITE_S)
    end
    def has?(colour)
      (self.board.to_a[self.across][self.down] == colour)
    end
    def have(colour)
      arr = self.board.to_a
      arr[self.across][self.down] = colour
      self.board.as_str = arr.inspect
      self
    end
    def blacken
      self.have(BLACK_S)
    end
    def whiten
      self.have(WHITE_S)
    end
    def remove
      arr = self.board.to_a
      arr[self.across][self.down] = nil
      self.board.as_str = arr.inspect
      self
    end
    def adjacent_scalars(offset)
      if (offset == 0) then
        [(offset + 1)]
      else
        if (offset == (board.dimension - 1)) then
          [(offset - 1)]
        else
          [(offset + 1), (offset - 1)]
        end
      end
    end
    def adjacent_locations
      (self.adjacent_scalars(self.across).map do |it|
        Location.for(board, it, self.down)
      end + self.adjacent_scalars(self.down).map do |it|
        Location.for(board, self.across, it)
      end)
    end
    def liberties
      self.adjacent_locations.select { |its| its.open? }
    end
    def has_liberty?
      (not self.liberties.empty?)
    end
    def left_edge?
      (self.across == 0)
    end
    def right_edge?
      (self.across == (self.board.dimension - 1))
    end
    def center?
      ((not self.left_edge?) and (not self.right_edge?))
    end
    def top_edge?
      (self.down == 0)
    end
    def bottom_edge?
      (self.down == (self.board.dimension - 1))
    end
    def middle?
      ((not self.top_edge?) and (not self.bottom_edge?))
    end
    def hoshi?
      self.board.hoshi_points.include?(self)
    end
    def to_s
      (LETTERS[self.across] + LETTERS[self.down]).downcase
    end
  end
  module Grouping
    attr_accessor(:board)
    def self.for(board, *locations)
      lambda do |it|
        it.extend(self)
        it.board = board
        it
      end.call(locations)
    end
    def self.groupings_for_one_colour(board, stones)
      stones.inject([]) do |groupings_so_far, stone|
        raise("I screwed this up") unless stone.kind_of?(Location)
        groupings_adjacent_to_this_stone = stone.adjacent_locations.map do |adjacent_location|
          groupings_so_far.detect { |it| it.include?(adjacent_location) }
        end.compact
        if (groupings_adjacent_to_this_stone.size == 0) then
          (groupings_so_far << self.for(board, stone))
        else
          if (groupings_adjacent_to_this_stone.size == 1) then
            (groupings_adjacent_to_this_stone.first << stone)
          else
            groupings_so_far = ((groupings_so_far - groupings_adjacent_to_this_stone) + [self.for(board, *(groupings_adjacent_to_this_stone.inject(&:+) + [stone]))])
          end
        end
        groupings_so_far
      end
    end
    def liberties
      self.map { |its| its.liberties }.inject([], &:+)
    end
    def alive?
      self.any? { |it| it.has_liberty? }
    end
    def dead?
      (not self.alive?)
    end
  end
  class Column
    attr_accessor(:board)
    attr_accessor(:across)
    def initialize(board, across)
      self.board = board
      self.across = across
    end
    def [](down)
      Location.for(board, self.across, down)
    end
    def []=(down, value)
      lambda do |location|
        if value.nil? then
          location.remove
        else
          if ((value == WHITE_S) or (value == BLACK_S)) then
            location.have(value)
          else
            raise(Wtf.new("WTF is a #{value.inspect}?"))
          end
        end
        location
      end.call(Location.for(board, self.across, down))
    end
  end
  def initialize(str, dimension)
    self.as_str = str
    self.dimension = dimension
    initialize_as_str
  end
  def self.validate_for(belongs_to, *board_attrs)
    board_attrs.each do |sym|
      board = belongs_to.send(sym)
      undead = board.dead_stones.all
      unless undead.empty? then
        belongs_to.errors.add(sym, "The stones at #{undead.to_sentence} are dead")
      end
      unless DIMENSIONS.include?(board.dimension) then
        belongs_to.errors.add(sym, "#{board.dimension} is not a valid board size")
      end
    end
  end
  STARS = Board::DIMENSIONS.inject(Hash.new) do |sizes_to_game_sets, dimension|
    sizes_to_game_sets.merge(dimension => ((offset = (dimension <= 11) ? (3) : (4)
    top = left = (offset - 1)
    middle = (dimension / 2)
    bottom = right = (dimension - offset)
    { 2 => ([[left, bottom], [right, top]]), 3 => ([[left, bottom], [right, top], [right, bottom]]), 4 => ([[left, bottom], [right, top], [right, bottom], [left, top]]), 5 => ([[left, bottom], [right, top], [right, bottom], [left, top], [middle, middle]]), 6 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle]]), 7 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle], [middle, middle]]), 8 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle], [middle, top], [middle, bottom]]), 9 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle], [middle, top], [middle, bottom], [middle, middle]]) })))
  end
  HOSHI = Board::DIMENSIONS.inject(Hash.new) do |board_size_to_number_of_hoshi, dimension|
    board_size_to_number_of_hoshi.merge(if (dimension < 13) then
      { dimension => 4 }
    else
      (dimension < 17) ? ({ dimension => 5 }) : ({ dimension => 9 })
    end)
  end
  def star_points(number_of_stones)
    STARS[self.dimension][number_of_stones]
  end
  def hoshi_points
    @hoshi_points ||= self.star_points(HOSHI[self.dimension])
  end
  def handicap(number_of_stones)
    self.star_points(number_of_stones).each do |across, down|
      self[across][down].blacken
    end
  end
  LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"]
  SGF_BLACK_PLACEMENT_PROPERTIES = ["B", "AB"]
  SGF_WHITE_PLACEMENT_PROPERTIES = ["W", "AW"]
  def valid_position?(str)
    (not (not parse_position(str)))
  end
  TEMPLATES = DIMENSIONS.inject(Hash.new) do |templates, dim|
    templates.merge(dim => (lambda do |arr|
      (1..(dim - 2)).each do |num|
        arr[0][num] = :left
        arr[num][0] = :top
        arr[num][-1] = :bottom
        arr[-1][num] = :right
      end
      arr[0][0] = :topleft
      arr[0][-1] = :bottomleft
      arr[-1][0] = :topright
      arr[-1][-1] = :bottomright
      STARS[dim][HOSHI[dim]].each { |across, down| arr[across][down] = :star }
      arr
    end.call((1..dim).map { ([:blank] * dim) })))
  end
  def map_array(map)
    arr = self.to_a
    template = TEMPLATES[self.dimension]
    (0..(self.dimension - 1)).map do |across|
      (0..(self.dimension - 1)).map do |down|
        map[template[across][down]][arr[across][down]]
      end
    end
  end
  def [](str_or_symbol_or_offset)
    if str_or_symbol_or_offset.kind_of?(Integer) then
      return Column.new(self, str_or_symbol_or_offset)
    else
      str = str_or_symbol_or_offset.to_s.downcase
      if valid_position?(str) then
        return parse_position(str)
      else
        super(str_or_symbol_or_offset)
      end
    end
  end
  def +(something)
    if (something.respond_to?(:across) and (something.respond_to?(:down) and something.respond_to?(:colour))) then
      (self + [something])
    else
      lambda do |other|
        something.each do |its|
          other[its.across][its.down] = its.colour unless its.colour.nil?
        end
        other
      end.call(self.dup)
    end
  end
  def -(something)
    if (something.respond_to?(:across) and something.respond_to?(:down)) then
      (self - [something])
    else
      lambda do |other|
        something.each { |its| other[its.across][its.down].remove }
        other
      end.call(self.dup)
    end
  end
  def to_a
    initialize_as_str
    eval(self.as_str)
  end
  def groupings
    black_offsets, white_offsets = self.stone_locations
    BlacksAndWhites.for(Grouping.groupings_for_one_colour(self, black_offsets), Grouping.groupings_for_one_colour(self, white_offsets))
  end
  def dead_groupings
    self.groupings.map do |groupings_of_one_colour|
      groupings_of_one_colour.select { |its| its.dead? }
    end
  end
  def dead_stones
    self.dead_groupings.map { |it| it.inject([], &:+) }
  end
  def stone_locations
    returning(BlacksAndWhites.for([], [])) do |blacks, whites|
      (0..(self.dimension - 1)).each do |across|
        (0..(self.dimension - 1)).each do |down|
          if (self.to_a[across][down] == BLACK_S) then
            (blacks << Location.for(self, across, down))
          else
            if (self.to_a[across][down] == WHITE_S) then
              (whites << Location.for(self, across, down))
            end
          end
        end
      end
    end
  end
  def parse_position(str)
    offsets = str.scan(/[abcdefghijklmnopqrst]/i).map { |its| LETTERS.index(its.upcase) }.select do |it|
      (it and ((it >= 0) and (it < dimension)))
    end
    Location.for(self, offsets.first, offsets.last) if (offsets.size == 2)
  end
  def initialize_as_str
    if self.as_str.blank? then
      self.as_str = (1..self.dimension).map { ([nil] * self.dimension) }.inspect
    end
  end
  protected
  def []=(str_or_symbol, value)
    initialize_as_str
    str = str_or_symbol.to_s.downcase
    if valid_position?(str) then
      arr = self.to_a
      loc = parse_position(str)
      value.nil? ? (loc.remove) : (loc.have(value))
      loc
    else
      super(str_or_symbol)
    end
  end
end