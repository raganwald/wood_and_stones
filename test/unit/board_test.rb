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
  
  context "dimensions and valid positions" do
    
    setup do
      @thirteen_board = Board.create(:dimension => 13)
      @nineteen_board = Board.create(:dimension => 19)
    end
    
    should "reject entirely invalid positions" do
      assert !@thirteen_board.valid_position?('a')
      assert !@thirteen_board.valid_position?('2')
      assert !@thirteen_board.valid_position?('a0')
    end
    
    should "reject oversized top left corner" do
      assert !@thirteen_board.valid_position?('a14')
      assert !@nineteen_board.valid_position?('a20')
    end
    
    should "reject oversized top right corner" do
      assert !@thirteen_board.valid_position?('o14')
      assert !@nineteen_board.valid_position?('u20')
    end
    
    should "reject oversized bottom right corner" do
      assert !@thirteen_board.valid_position?('o1')
      assert !@nineteen_board.valid_position?('u1')
    end
    
    should "accept top left corner" do
      assert  @thirteen_board.valid_position?('a13')
      assert  @nineteen_board.valid_position?('a19')
    end
    
    should "accept top right corner" do
      assert  @thirteen_board.valid_position?('n13')
      assert  @nineteen_board.valid_position?('t19')
    end
    
    should "accept bottom right corner" do
      assert  @thirteen_board.valid_position?('n1')
      assert  @nineteen_board.valid_position?('t1')
    end
    
    should "accept lower left corner" do
      assert  @thirteen_board.valid_position?('a1')
      assert  @nineteen_board.valid_position?('a1')
    end
    
  end  
  
end