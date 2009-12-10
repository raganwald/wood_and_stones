class Board < ActiveRecord::Base
  DIMENSIONS = [9, 11, 13, 15, 17, 19]
  class Occupied < Exception
  end
  class Wtf < Exception
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
      self.has?("black")
    end
    def white?
      self.has?("white")
    end
    def has?(colour)
      (self.board.to_a[self.across][self.down] == colour)
    end
    def have(colour)
      arr = self.board.to_a
      arr[self.across][self.down] = colour
      self.board.array_hack = arr.inspect
      self
    end
    def blacken
      self.have("black")
    end
    def whiten
      self.have("white")
    end
    def remove
      arr = self.board.to_a
      arr[self.across][self.down] = nil
      self.board.array_hack = arr.inspect
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
          if ((value == "white") or (value == "black")) then
            location.have(value)
          else
            raise(Wtf.new("WTF is a #{value.inspect}?"))
          end
        end
        location
      end.call(Location.for(board, self.across, down))
    end
  end
  before_validation_on_create(:initialize_array_hack)
  validates_inclusion_of(:dimension, :in => (DIMENSIONS))
  validate do |board|
    undead = board.dead_stones.all
    unless undead.empty? then
      board.errors.add_to_base("The stones at #{undead.to_sentence} are dead")
    end
  end
  STARS = Board::DIMENSIONS.inject(Hash.new) do |sizes_to_game_sets, dimension|
    sizes_to_game_sets.merge(dimension => ((offset = (dimension <= 11) ? (3) : (4)
    top = left = (offset - 1)
    middle = (dimension / 2)
    bottom = right = (dimension - offset)
    { 2 => ([[left, bottom], [right, top]]), 3 => ([[left, bottom], [right, top], [right, bottom]]), 4 => ([[left, bottom], [right, top], [right, bottom], [left, top]]), 5 => ([[left, bottom], [right, top], [right, bottom], [left, top], [middle, middle]]), 6 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle]]), 7 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle], [middle, middle]]), 8 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle], [middle, top], [middle, bottom]]), 9 => ([[left, bottom], [right, top], [right, bottom], [left, top], [left, middle], [right, middle], [middle, top], [middle, bottom], [middle, middle]]) })))
  end
  def star_points(number_of_stones)
    STARS[self.dimension][number_of_stones]
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
  def []=(str_or_symbol, value)
    initialize_array_hack
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
  def to_a
    initialize_array_hack
    eval(self.array_hack)
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
          if (self.to_a[across][down] == "black") then
            (blacks << Location.for(self, across, down))
          else
            if (self.to_a[across][down] == "white") then
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
  def initialize_array_hack
    if self.array_hack.blank? then
      self.array_hack = (1..self.dimension).map { ([nil] * self.dimension) }.inspect
    end
  end
end