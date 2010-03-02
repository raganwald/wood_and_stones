require("ostruct")
class Board
  attr_reader(:stones_array)
  attr_accessor(:dimension)
  DIMENSIONS = [9, 11, 13, 15, 17, 19]
  BLACK_S, WHITE_S = "black", "white"
  LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"]
  def self.position_to_location(str)
    str.scan(/[abcdefghijklmnopqrst]/i).map do |l|
      Board::LETTERS.index(l.upcase)
    end.select do |i|
      (i and ((i >= 0) and (i < 18)))
    end
  end
  def self.location_to_position(arr)
    "#{Board::LETTERS[arr[0]]}#{Board::LETTERS[arr[1]]}".downcase
  end
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
      self.board.stones_array[self.across][self.down].blank?
    end
    def black?
      self.has?(BLACK_S)
    end
    def white?
      self.has?(WHITE_S)
    end
    def has?(colour)
      (self.board.stones_array[self.across][self.down] == colour)
    end
    def have(colour)
      self.board.stones_array[self.across][self.down] = colour
      self
    end
    def blacken
      self.have(BLACK_S)
    end
    def whiten
      self.have(WHITE_S)
    end
    def remove
      self.board.stones_array[self.across][self.down] = nil
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
    def to_a
      [self.across, self.down]
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
  def self.validate_for(belongs_to, *board_attrs)
    board_attrs.each do |sym|
      board = belongs_to.send(sym)
      board.invalid_reasons.each { |reason| belongs_to.errors.add(sym, reason) }
    end
  end
  state_machine(:state, :initial => :writable) do ||
    event(:lock) { || transition(:writable => :readable) }
    after_transition(any => :readable) do |board, transition|
      board.stones_array.freeze
      board.stones_array.each(&:freeze)
    end
    state(:writable) do ||
      def as_str=(str)
        @stones_array = eval(str)
      end
      def stones_array=(arr)
        @stones_array = arr
      end
      def []=(str_or_symbol, value)
        str = str_or_symbol.to_s.downcase
        if valid_position?(str) then
          loc = parse_position(str)
          value.nil? ? (loc.remove) : (loc.have(value))
          loc
        else
          super(str_or_symbol, value)
        end
      end
      def handicap(number_of_stones)
        self.star_points(number_of_stones).each do |across, down|
          self[across][down].blacken
        end
      end
    end
    state(:readable) do ||
      def invalid_reasons
        lambda do |reasons|
          undead = self.dead_stones.all
          unless undead.empty? then
            (reasons << "The stones at #{undead.to_sentence} are dead")
          end
          reasons
        end.call([])
      end
      def valid?
        self.invalid_reasons.empty?
      end
      def map_array(map)
        template = TEMPLATES[self.dimension]
        (0..(self.dimension - 1)).map do |across|
          (0..(self.dimension - 1)).map do |down|
            map[template[across][down]][self.stones_array[across][down]]
          end
        end
      end
      def +(something)
        if (something.respond_to?(:across) and (something.respond_to?(:down) and something.respond_to?(:colour))) then
          (self + [something])
        else
          Board.new(self.dimension, self.as_str) do |other|
            something.each do |its|
              other[its.across][its.down] = its.colour unless its.colour.nil?
            end
          end
        end
      end
      def -(something)
        if (something.respond_to?(:across) and something.respond_to?(:down)) then
          (self - [something])
        else
          Board.new(self.dimension, self.as_str) do |other|
            something.each { |its| other[its.across][its.down].remove }
          end
        end
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
      def empty_locations
        lambda do |empties|
          (0..(self.dimension - 1)).each do |across|
            (0..(self.dimension - 1)).each do |down|
              if self.stones_array[across][down].nil? then
                (empties << Location.for(self, across, down))
              end
            end
          end
          empties
        end.call([])
      end
      def stone_locations
        returning(BlacksAndWhites.for([], [])) do |blacks, whites|
          (0..(self.dimension - 1)).each do |across|
            (0..(self.dimension - 1)).each do |down|
              if (self.stones_array[across][down] == BLACK_S) then
                (blacks << Location.for(self, across, down))
              else
                if (self.stones_array[across][down] == WHITE_S) then
                  (whites << Location.for(self, across, down))
                end
              end
            end
          end
        end
      end
      def stone_positions
        stone_locations.map do |one_colour|
          one_colour.map do |one_location|
            __126756269625589__ = one_location
            if __126756269625589__.kind_of?(Array) then
              RewriteRails::ExtensionMethods::Array.to_position(__126756269625589__)
            else
              __126756269625589__.to_position
            end
          end
        end
      end
      def info(debug = false)
        aa = self.adjacents_array
        lambda do |rval|
          (0..(self.dimension - 1)).each do |across|
            (0..(self.dimension - 1)).each do |down|
              colour = stones_array[across][down]
              if colour.blank? then
                if aa[across][down].any? { |a_adj, d_adj| stones_array[a_adj][d_adj].blank? } then
                  (rval.empty_place_liberties << [across, down])
                end
              else
                rval.belong_to_group[across][down] = [across, down]
                rval.group_liberties_by_location[across][down] = []
                aa[across][down].each do |a_adj, d_adj|
                  adj_colour = stones_array[a_adj][d_adj]
                  if adj_colour.blank? then
                    group = rval.belong_to_group[across][down]
                    (lib_arr = rval.group_liberties_by_location[group[0]][group[1]]
                    if debug then
                      puts("discovered liberty #{[a_adj, d_adj].inspect} and adding it to liberties #{lib_arr.inspect} belonging to group #{group.inspect}")
                    end
                    (lib_arr << [a_adj, d_adj])
                    lib_arr.uniq!)
                  else
                    if ((adj_colour == colour) and ((a_adj < across) or ((a_adj == across) and (d_adj < down)))) then
                      adj_bt = rval.belong_to_group[a_adj][d_adj]
                      this_bt = rval.belong_to_group[across][down]
                      unless (adj_bt == this_bt) then
                        case (adj_bt <=> this_bt)
                        when -1 then
                          from, to = this_bt, adj_bt
                        when 1 then
                          from, to = adj_bt, this_bt
                        when 0 then
                          raise("unexpected error in Board#info")
                        else
                          # do nothing
                        end
                        puts("merging group: #{from.inspect} into group: #{to.inspect}") if debug
                        if debug then
                          puts("merging liberties #{rval.group_liberties_by_location[from[0]][from[1]].inspect} into #{rval.group_liberties_by_location[to[0]][to[1]].inspect} belonging to group: #{to.inspect}")
                        end
                        rval.group_liberties_by_location[to[0]][to[1]] += rval.group_liberties_by_location[from[0]][from[1]]
                        rval.group_liberties_by_location[from[0]][from[1]] = nil
                        rval.group_liberties_by_location[to[0]][to[1]].uniq!
                        (0..across).each do |i_across|
                          (0..(self.dimension - 1)).each do |i_down|
                            if (rval.belong_to_group[i_across][i_down] == from) then
                              if debug then
                                puts("changing belongs_to of #{rval.belong_to_group[i_across][i_down].inspect} to #{to.inspect}")
                              end
                              rval.belong_to_group[i_across][i_down] = to
                            end
                          end
                        end
                      end
                    end
                  end
                end
              end
            end
          end
          if debug then
            messages = []
            (0..(self.dimension - 1)).each do |across|
              (0..(self.dimension - 1)).each do |down|
                (messages << "rval.group_liberties_by_location[#{across}][#{down}]: #{rval.group_liberties_by_location[across][down].inspect}")
              end
            end
            puts(messages.join(", "))
          end
          group_locations_to_liberties_and_stones = {  }
          (0..(self.dimension - 1)).each do |across|
            (0..(self.dimension - 1)).each do |down|
              unless rval.group_liberties_by_location[across][down].blank? then
                group_locations_to_liberties_and_stones[[across, down]] ||= OpenStruct.new(:liberties => (rval.group_liberties_by_location[across][down]), :stones => ([]))
                if debug then
                  puts("group_locations_to_liberties_and_stones[#{[across, down].inspect}]: #{group_locations_to_liberties_and_stones[[across, down]].inspect}")
                end
              end
              unless rval.belong_to_group[across][down].blank? then
                if debug then
                  puts("group_locations_to_liberties_and_stones[#{rval.belong_to_group[across][down].inspect}]: ???")
                end
                (group_locations_to_liberties_and_stones[rval.belong_to_group[across][down]].stones << [across, down])
              end
            end
          end
          rval.group_liberties = group_locations_to_liberties_and_stones.inject([[], []]) do |acc, val|
            lambda do |blacks_and_whites|
              location, liberties_and_stones = *val
              across, down = *location
              (blacks_and_whites[(self.stones_array[across][down] == Board::BLACK_S) ? (0) : (1)] << liberties_and_stones)
              blacks_and_whites
            end.call(acc)
          end
          rval
        end.call(OpenStruct.new(:belong_to_group => (dim_by_dim_array), :group_liberties_by_location => (dim_by_dim_array), :empty_place_liberties => ([]), :group_liberties => ([[], []])))
      end
      def legal_moves_for(player)
        if (player == BLACK_S) then
          player_i, opponent_i, opponent = 0, 1, WHITE_S
        else
          player_i, opponent_i, opponent = 1, 0, BLACK_S
        end
        empty_placements_with_liberty = self.info.empty_place_liberties.map do |it|
          OpenStruct.new(:location => (it), :dead_stones => ([]))
        end
        placements_that_grow_player_groups = self.info.group_liberties[player_i].select do |liberties_and_stones|
          (liberties_and_stones.liberties.size > 1)
        end.map do |liberties_and_stones|
          liberties_and_stones.liberties.map do |it|
            OpenStruct.new(:location => (it), :dead_stones => ([]))
          end
        end.inject([], &:+)
        placements_that_capture = self.info.group_liberties[opponent_i].select do |liberties_and_stones|
          (liberties_and_stones.liberties.size == 1)
        end.map do |its|
          OpenStruct.new(:location => (its.liberties.first), :dead_stones => (its.stones))
        end
        ((empty_placements_with_liberty + placements_that_grow_player_groups) + placements_that_capture).inject({}) do |legal_move_hash, location_and_dead_stones|
          lambda do |h|
            h[location_and_dead_stones.location] ||= []
            h[location_and_dead_stones.location] += location_and_dead_stones.dead_stones
            h
          end.call(legal_move_hash)
        end.map do |location, dead_stones|
          OpenStruct.new(:location => (location), :dead_stones => (dead_stones))
        end
      end
      def adjacent_scalars_lambda
        lambda do |magnitude|
          if (magnitude == 0) then
            return [(magnitude + 1)]
          else
            if (magnitude == (self.dimension - 1)) then
              return [(magnitude - 1)]
            else
              return [(magnitude - 1), (magnitude + 1)]
            end
          end
        end
      end
      def adjacents_priors_helper(scalar_lambda)
        lambda do |a|
          (0..(self.dimension - 1)).each do |across|
            a_adj = scalar_lambda[across]
            (0..(self.dimension - 1)).each do |down|
              d_adj = scalar_lambda[down]
              a_adj.each { |a_e| (a[across][down] << [a_e, down]) }
              d_adj.each { |d_e| (a[across][down] << [across, d_e]) }
            end
          end
          a
        end.call((1..self.dimension).map { (1..self.dimension).map { Array.new } })
      end
      def adjacents_array
        @@adjacents_array ||= {  }
        @@adjacents_array[self.dimension] ||= adjacents_priors_helper(self.adjacent_scalars_lambda)
      end
    end
  end
  def initialize(dimension_or_board, str = nil)
    super()
    if dimension_or_board.kind_of?(Fixnum) then
      self.dimension = dimension_or_board
      self.as_str = str unless str.blank?
      self.stones_array ||= self.dim_by_dim_array
    else
      if dimension_or_board.kind_of?(Board) then
        self.dimension = dimension_or_board.dimension
        self.stones_array = dimension_or_board.stones_array.map { |it| it.map { |it| it } }
      end
    end
    yield(self) if block_given?
    self.lock
    self
  end
  def as_str
    self.stones_array.inspect
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
  def to_a
    self.stones_array
  end
  protected
  def dim_by_dim_array
    (1..self.dimension).map { ([nil] * self.dimension) }
  end
  def parse_position(str)
    offsets = str.scan(/[abcdefghijklmnopqrst]/i).map { |its| LETTERS.index(its.upcase) }.select do |it|
      (it and ((it >= 0) and (it < self.dimension)))
    end
    Location.for(self, offsets.first, offsets.last) if (offsets.size == 2)
  end
end
