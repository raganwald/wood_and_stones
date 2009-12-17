require File.dirname(__FILE__) + '/../test_helper'

class BoardTest < ActiveRecord::TestCase
  
  context "boards" do
    
    context "with a valid dimension" do
      
      setup do
        @board = Board.create(:dimension => 13)
      end
      
      should "be valid" do
        assert_valid @board
      end
      
    end
    
  end
  
  context "Locations" do
    
    setup do
      @board = Board.create(:dimension => 9)
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
      @board = Board.create(:dimension => 9)
    end
    
    context "for an empty board" do
      
      should "be empty" do
        assert_equal [[], []], @board.dead_stones()
      end
      
    end
    
    context "for a board with a single stone of each colour" do
      
      setup do
        @board = Board.create(:dimension => 9) do |b|
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
        @board = Board.create(:dimension => 9) do |b|
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
        @board = Board.create(:dimension => 9) do |b|
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
        @board = Board.create(:dimension => 9)
      end
      
      should "be empty" do
        assert_equal [[], []], @board.groupings
      end
      
    end
    
    context "for a board with a single stone of each colour" do
      
      setup do
        @board = Board.create(:dimension => 9) do |b|
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
        @board = Board.create(:dimension => 9) do |b|
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
      @board = Board.create(:dimension => 9) do |b|
        b['aa'] = Board::BLACK_S
        b['bb'] = Board::WHITE_S
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
      @board = Board.create(:dimension => 13)
    end
    
    should "retrieve empty stones in the four corners" do
      assert @board['aa'].open?
      assert @board['am'].open?
      assert @board['ma'].open?
      assert @board['mm'].open?
    end
    
    should "allow placement of stones in handicap spots" do
      assert_nothing_raised do
        @board['dd'] = Board::BLACK_S
        @board['jd'] = Board::WHITE_S
        @board['jj'] = Board::BLACK_S
        @board['dj'] = Board::WHITE_S
      end
    end
  
    context "when stones are placed in handicap spots" do
    
      setup do
        @board['dd'] = Board::BLACK_S
        @board['jd'] = Board::WHITE_S
        @board['jj'] = Board::BLACK_S
        @board['dj'] = Board::WHITE_S
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
        @board['dc'] = Board::BLACK_S
        @board['cd'] = Board::BLACK_S
        @board['dd'] = Board::WHITE_S
        @board['ed'] = Board::BLACK_S
        @board['de'] = Board::BLACK_S
      end
      
      should "not be valid because the white stone is dead" do
        assert !@board.valid?
      end
      
    end
      
  end
  
  
  context "dimensions and valid positions" do
    # right then down
    
    setup do
      @thirteen_board = Board.create(:dimension => 13) # mm
      @nineteen_board = Board.create(:dimension => 19) # ss
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
  
end