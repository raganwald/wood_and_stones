require File.dirname(__FILE__) + '/../test_helper'

class BoardTest < ActiveRecord::TestCase
  
  context "boards" do
    
    context "with a valid dimension" do
      
      setup do
        @board = Board.create(:dimension => 13)
      end
      
      should "be valid" do
        assert @board.valid?
      end
      
    end
    
  end
  
  context "adjacents" do
    
    setup do
      @board = Board.create(:dimension => 9)
    end
    
    context "for corners" do
      
      should "be two for the top left corner" do
        assert_equal 2, @board.stone_adjacents(0,0).size
      end
      
      should "be two for the bottom left corner" do
        assert_equal 2, @board.stone_adjacents(0,8).size
      end
      
      should "be two for the top right corner" do
        assert_equal 2, @board.stone_adjacents(8,0).size
      end
      
      should "be two for the bottom right corner" do
        assert_equal 2, @board.stone_adjacents(8,8).size
      end
      
    end
    
    context "for sides" do
      
      should "be three for the top side" do
        (1..7).each do |across|
          assert_equal(3, @board.stone_adjacents(across, 0).size)
        end
      end
      
      should "be three for the bottom side" do
        (1..7).each do |across|
          assert_equal(3, @board.stone_adjacents(across, 8).size)
        end
      end
      
      should "be three for the left side" do
        (1..7).each do |down|
          assert_equal 3, @board.stone_adjacents(0, down).size
        end
      end
      
      should "be three for the right side" do
        (1..7).each do |down|
          assert_equal 3, @board.stone_adjacents(8, down).size
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
          b['aa'] = 'black'
          b['bb'] = 'white'
        end
      end
      
      should "be empty" do
        assert_equal [[], []], @board.dead_stones()
      end
      
    end
    
    context "for a stone trapped in the corner" do
      
      setup do
        @board = Board.create(:dimension => 9) do |b|
          b['aa'] = 'black'
          b['ba'] = 'white'
          b['ab'] = 'white'
        end
      end
      
      should "be empty" do
        assert_equal [[[0,0]], []], @board.dead_stones()
      end
      
    end
    
    context "for a couple of stones trapped along an edge" do
      
      setup do
        @board = Board.create(:dimension => 9) do |b|
          b['aa'] = 'black'
          b['bb'] = 'black'
          b['cb'] = 'black'
          b['da'] = 'black'
          b['ba'] = 'white'
          b['ca'] = 'white'
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
          b['aa'] = 'black'
          b['ba'] = 'white'
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
          b['aa'] = 'black'
          b['ba'] = 'black'
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
        b['aa'] = 'black'
        b['bb'] = 'white'
      end
    end
    
    should "produce correct stone offsets" do
      assert_equal [ [[0, 0]], [[1, 1]]], @board.stone_offsets
    end
    
    should "produce an array with exactly one stone of each colour" do
      arr = [ 
        ['black', nil, nil, nil, nil, nil, nil, nil, nil], 
        [nil, 'white', nil, nil, nil, nil, nil, nil, nil], 
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
      assert @board['aa'].nil?
      assert @board['am'].nil?
      assert @board['ma'].nil?
      assert @board['mm'].nil?
    end
    
    should "allow placement of stones in handicap spots" do
      assert_nothing_raised do
        @board['dd'] = 'black'
        @board['jd'] = 'white'
        @board['jj'] = 'black'
        @board['dj'] = 'white'
      end
    end
  
    context "when stones are placed in handicap spots" do
    
      setup do
        @board['dd'] = 'black'
        @board['jd'] = 'white'
        @board['jj'] = 'black'
        @board['dj'] = 'white'
      end
    
      should "retrieve empty stones in the four corners" do
        assert @board['aa'].nil?
        assert @board['am'].nil?
        assert @board['ma'].nil?
        assert @board['mm'].nil?
      end
    
      should "retrieve the placed stones" do
        assert @board['dd'] == 'black'
        assert @board['jd'] == 'white'
        assert @board['jj'] == 'black'
        assert @board['dj'] == 'white'
      end
      
      should "reject placement of stones in the handicap spots" do
        assert_raise(Board::Occupied) do
          @board['dd'] = 'black'
        end
        assert_raise(Board::Occupied) do
          @board['jd'] = 'white'
        end
        assert_raise(Board::Occupied) do
          @board['jj'] = 'black'
        end
        assert_raise(Board::Occupied) do
          @board['dj'] = 'white'
        end
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