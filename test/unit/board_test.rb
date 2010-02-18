require File.dirname(__FILE__) + '/../test_helper'

class BoardTest < ActiveRecord::TestCase
  
=begin
  
  context "boards" do
    
    context "with a valid dimension" do
      
      setup do
        @board = Board.new(13)
      end
      
      should "be valid" do
        assert @board.valid?
      end
      
    end
    
  end
  
  context "Templates" do
    
    context "for a 9x9 board" do
      
      setup do
        @template = Board::TEMPLATES[9]
      end
      
      should "have a correct top left corner" do
        assert_equal(:topleft, @template[0][0])
      end
      
      should "have a correct right edge" do
        assert_equal(:right, @template[8][3])
      end
      
      should "have the correct dimensions" do
        assert_equal(9, @template.size)
        (0..8).each do |col|
          assert_equal(9, @template[col].size)
        end
      end
    
      context "and Maps" do
      
        setup do
          @board = returning(Board.new( 9)) do |b|
            b[0][0].blacken
            b[1][1].whiten
            b[2][2].blacken
            b[8][2].whiten
          end
          map = {
            :topleft => {
              nil => '0nw',
              'black' => '1nw',
              'white' => '2nw'
            },
            :top => {
              nil => '0n',
              'black' => '1n',
              'white' => '2n'
            },
            :topright => {
              nil => '0ne',
              'black' => '1ne',
              'white' => '2ne'
            },
            :left => {
              nil => '0w',
              'black' => '1w',
              'white' => '2w'
            },
            :right => {
              nil => '0e',
              'black' => '1e',
              'white' => '2e'
            },
            :bottomleft => {
              nil => '0sw',
              'black' => '1sw',
              'white' => '2sw'
            },
            :bottom => {
              nil => '0s',
              'black' => '1s',
              'white' => '2s'
            },
            :bottomright => {
              nil => '0se',
              'black' => '1se',
              'white' => '2se'
            },
            :blank => {
              nil => '0',
              'black' => '1',
              'white' => '2'
            },
            :star => {
              nil => '0c',
              'black' => '1',
              'white' => '2'
            }
          }
          @mapped_array = @board.map_array(map)
        end
        
        # should "debug" do
        #   puts Board::TEMPLATES[9].inspect
        # end
      
        should "have the correct top left corner" do
          assert_equal('1nw', @mapped_array[0][0])
        end
        
        should "have the correct inner spot" do
          assert_equal('2', @mapped_array[1][1])
        end
        
        should "have the correct blank spot" do
          assert_equal('0', @mapped_array[1][4])
        end
        
        should "have the correct star spot" do
          assert_equal('0c', @mapped_array[6][6])
        end
        
        should "have the correct occupied star spot" do
          assert_equal('1', @mapped_array[2][2])
        end
        
        should "have the correct blank edge" do
          assert_equal('0s', @mapped_array[2][8])
        end
        
        should "have the correct occupied edge" do
          assert_equal('2e', @mapped_array[8][2])
        end
        
      end
      
    end
    
  end

  context "Locations" do
    
    setup do
      @board = Board.new(9)
    end
    
    context "for corners" do
      
      should "be two for the top left corner" do
        assert_equal 2, Board::Location.for(@board,0,0).adjacent_locations.size
      end
      
      should "be two for the bottom left corner" do
        assert_equal 2, Board::Location.for(@board,0,8).adjacent_locations.size
      end
      
      should "be two for the top right corner" do
        assert_equal 2, Board::Location.for(@board,8,0).adjacent_locations.size
      end
      
      should "be two for the bottom right corner" do
        assert_equal 2, Board::Location.for(@board,8,8).adjacent_locations.size
      end
      
    end
    
    context "for sides" do
      
      should "be three for the top side" do
        (1..7).each do |across|
          assert_equal(3, Board::Location.for(@board,across, 0).adjacent_locations.size)
        end
      end
      
      should "be three for the bottom side" do
        (1..7).each do |across|
          assert_equal(3, Board::Location.for(@board,across, 8).adjacent_locations.size)
        end
      end
      
      should "be three for the left side" do
        (1..7).each do |down|
          assert_equal 3, Board::Location.for(@board,0, down).adjacent_locations.size
        end
      end
      
      should "be three for the right side" do
        (1..7).each do |down|
          assert_equal 3, Board::Location.for(@board,8, down).adjacent_locations.size
        end
      end
      
    end
    
  end
  
  context "dead stones" do
      
    setup do
      @board = Board.new(9)
    end
    
    context "for an empty board" do
      
      should "be empty" do
        assert_equal [[], []], @board.dead_stones()
      end
      
    end
    
    context "for a board with a single stone of each colour" do
      
      setup do
        @board = Board.new(9) do |b|
          b['aa'] = Board::BLACK_S
          b['bb'] = Board::WHITE_S
        end
      end
      
      should "be empty" do
        assert_equal [[], []], @board.dead_stones()
      end
      
    end
    
    context "for a stone trapped in the corner" do
      
      setup do
        @board = Board.new(9) do |b|
          b['aa'] = Board::BLACK_S
          b['ba'] = Board::WHITE_S
          b['ab'] = Board::WHITE_S
        end
      end
      
      should "have no liberties" do
        assert Board::Location.for(@board, 0, 0).liberties.empty?
      end
      
      should "not have liberty" do
        assert !Board::Location.for(@board, 0, 0).has_liberty?
      end
      
      should "belong to a board with three groupings" do
        assert_equal [
          [ # blacks
            [[0,0]]
          ], 
          [ # whites
            [[0,1]], 
            [[1,0]]
          ]
        ], @board.groupings
      end
      
      context "the black stone grouping" do
        
        setup do
          @black_grouping = @board.groupings.first.first
        end
        
        should "be dead" do
          assert @black_grouping.dead?
        end
        
        should "not have liberties" do
          assert @black_grouping.liberties.empty?
        end
        
        should "have one stone in the corner" do
          assert_equal(Board::Location.for(@board, 0, 0), @black_grouping.first)
          assert_equal(1, @black_grouping.size)
        end
        
      end
      
      should "be a dead group" do
        assert_equal [[[0,0]], []], @board.dead_stones()
      end
      
    end
    
    context "for a couple of stones trapped along an edge" do
      
      setup do
        @board = Board.new(9) do |b|
          b['aa'] = Board::BLACK_S
          b['bb'] = Board::BLACK_S
          b['cb'] = Board::BLACK_S
          b['da'] = Board::BLACK_S
          b['ba'] = Board::WHITE_S
          b['ca'] = Board::WHITE_S
        end
      end
      
      should "be empty" do
        assert_equal [[], [[1,0], [2,0]]], @board.dead_stones()
      end
      
    end
      
  end
  
  context "groupings" do
    
    context "for an empty board" do
      
      setup do
        @board = Board.new(9)
      end
      
      should "be empty" do
        assert_equal [[], []], @board.groupings
      end
      
    end
    
    context "for a board with a single stone of each colour" do
      
      setup do
        @board = Board.new(9) do |b|
          b['aa'] = Board::BLACK_S
          b['ba'] = Board::WHITE_S
        end
      end
      
      should "produce two groupings, one for each stone" do
        assert_equal [
          [ # blacks
            [ # only grouping
              [0,0] # only stone
            ]
          ], 
          [ # whites
            [ # only grouping
              [1,0] # only stone
            ]
          ]
        ], @board.groupings
      end
      
    end
    
    context "for adjacent stones of the same colour" do
      
      setup do
        @board = Board.new(9) do |b|
          b['aa'] = Board::BLACK_S
          b['ba'] = Board::BLACK_S
        end
      end
      
      should "produce one grouping" do
        assert_equal [
          [ # blacks
            [ # only grouping
              [0,0], # first stone
              [1,0]  # second stone
            ]
          ], 
          [] # whites
        ], @board.groupings
      end
      
    end
    
  end
  
  context "a board with one black stone and one white stone" do
      
    setup do
      @board = Board.new(9) do
        self['aa'] = Board::BLACK_S
        self['bb'] = Board::WHITE_S
      end
    end
    
    should "produce correct stone offsets" do
      assert_equal [ [[0, 0]], [[1, 1]]], @board.stone_locations
    end
    
    should "produce an array with exactly one stone of each colour" do
      arr = [ 
        [Board::BLACK_S, nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, Board::WHITE_S, nil, nil, nil, nil, nil, nil, nil], 
        [nil, nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, nil, nil, nil, nil, nil, nil, nil, nil] 
      ]
      assert_equal(arr, @board.to_a)
    end
    
  end
  
  context "an empty board" do
      
    setup do
      @board = Board.new(13)
    end
    
    should "retrieve empty stones in the four corners" do
      assert @board['aa'].open?
      assert @board['am'].open?
      assert @board['ma'].open?
      assert @board['mm'].open?
    end
    
    should "allow placement of stones in handicap spots" do
      assert_nothing_raised do
        @board.instance_eval do
          self['dd'] = Board::BLACK_S
          self['jd'] = Board::WHITE_S
          self['jj'] = Board::BLACK_S
          self['dj'] = Board::WHITE_S
        end
      end
    end
  
    context "when stones are placed in handicap spots" do
    
      setup do
        @board.instance_eval do
          self['dd'] = Board::BLACK_S
          self['jd'] = Board::WHITE_S
          self['jj'] = Board::BLACK_S
          self['dj'] = Board::WHITE_S
        end
      end
    
      should "retrieve empty stones in the four corners" do
        assert @board['aa'].open?
        assert @board['am'].open?
        assert @board['ma'].open?
        assert @board['mm'].open?
      end
    
      should "retrieve the placed stones" do
        assert @board['dd'].black?
        assert @board['jd'].white?
        assert @board['jj'].black?
        assert @board['dj'].white?
      end
      
      # commented out (yecch!) to document a change in business rules
      # boards don't care about placing in occupied spots, actions
      # care about placing in occupied spots.
      #
      # boards only care about the legality of a static position like
      # playing into suicide.
      #
      # should "reject placement of stones in the handicap spots" do
      #   assert_raise(Board::Occupied) do
      #     @board['dd'] = Board::BLACK_S
      #   end
      #   assert_raise(Board::Occupied) do
      #     @board['jd'] = Board::WHITE_S
      #   end
      #   assert_raise(Board::Occupied) do
      #     @board['jj'] = Board::BLACK_S
      #   end
      #   assert_raise(Board::Occupied) do
      #     @board['dj'] = Board::WHITE_S
      #   end
      # end
      
    end
    
    context "when there is a dead stone" do
      
      setup do
        @board.instance_eval do
          self['dc'] = Board::BLACK_S
          self['cd'] = Board::BLACK_S
          self['dd'] = Board::WHITE_S
          self['ed'] = Board::BLACK_S
          self['de'] = Board::BLACK_S
        end
      end
      
      should "not be valid because the white stone is dead" do
        assert !@board.valid?
      end
      
    end
      
  end
  
  
  context "dimensions and valid positions" do
    # right then down
    
    setup do
      @thirteen_board = Board.new(13) # mm
      @nineteen_board = Board.new(19) # ss
    end
    
    should "reject entirely invalid positions" do
      assert !@thirteen_board.valid_position?('a')
      assert !@thirteen_board.valid_position?('b')
    end
    
    should "reject oversized bottom left corner" do
      assert !@thirteen_board.valid_position?('an')
      assert !@nineteen_board.valid_position?('at')
    end
    
    should "reject oversized bottom right corner" do
      assert !@thirteen_board.valid_position?('nn')
      assert !@nineteen_board.valid_position?('tt')
    end
    
    should "reject oversized top right corner" do
      assert !@thirteen_board.valid_position?('na')
      assert !@nineteen_board.valid_position?('ta')
    end
    
    should "accept top left corner" do
      assert  @thirteen_board.valid_position?('aa')
      assert  @nineteen_board.valid_position?('aa')
    end
    
    should "accept top right corner" do
      assert  @thirteen_board.valid_position?('ma')
      assert  @nineteen_board.valid_position?('sa')
    end
    
    should "accept bottom right corner" do
      assert  @thirteen_board.valid_position?('mm')
      assert  @nineteen_board.valid_position?('ss')
    end
    
    should "accept lower left corner" do
      assert  @thirteen_board.valid_position?('am')
      assert  @nineteen_board.valid_position?('as')
    end
    
  end  
  
=end

  context "legal_moves_for" do
    
    context "simple case" do
    
      setup do
        @board = Board.new(3) do
          self['ba'] = Board::BLACK_S
          self['bb'] = Board::WHITE_S
          self['cb'] = Board::BLACK_S
          self['bc'] = Board::BLACK_S
        end
      end
    
      context Board::BLACK_S do
      
        [[0,0], [0,1], [0,2], [2,0], [2,2]].each do |loc|
      
          should "include #{loc.inspect}" do
            legals = @board.legal_moves_for(Board::BLACK_S)
            assert legals.any? { |legal| legal.location == loc }, "#{legals.inspect} did not include #{loc.inspect}"
          end
        
        end
      
      end
    
      context Board::WHITE_S do
      
        [[0, 0], [0, 1], [0, 2]].each do |loc|
      
          should "include #{loc.inspect}" do
            legals = @board.legal_moves_for(Board::WHITE_S)
            assert legals.any? { |legal| legal.location == loc }, "#{legals.inspect} did not include #{loc.inspect}"
          end
        
        end
      
      end
    
    end
    
    context "capture case and multiple liberties case" do
    
      setup do
        @board = Board.new(3) do
          self['aa'] = Board::BLACK_S
          self['ac'] = Board::BLACK_S
          self['ba'] = Board::BLACK_S
          self['bb'] = Board::WHITE_S
          self['cb'] = Board::BLACK_S
          self['bc'] = Board::BLACK_S
        end
      end
    
      context Board::BLACK_S do
      
        [[0,1], [2,0], [2,2]].each do |loc|
      
          should "include #{loc.inspect}" do
            legals = @board.legal_moves_for(Board::BLACK_S)
            assert legals.any? { |legal| legal.location == loc }, "#{legals.inspect} did not include #{loc.inspect}"
          end
        
        end
      
      end
    
      context Board::WHITE_S do
      
        should "not have any legal moves" do
          legals = @board.legal_moves_for(Board::WHITE_S)
          assert legals.empty?, "#{legals.inspect} was not empty"
        end
      
      end
    
    end
    
  end
  
end