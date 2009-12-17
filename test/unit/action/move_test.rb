require File.dirname(__FILE__) + '/../../test_helper'

class Action::MoveTest < ActiveRecord::TestCase
  
  context Action::Move do
    
    setup do
      @before = Board.create(:dimension => 9)
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @game = Game.create(:dimension => 9, :black => @adam, :white => @eve)
      @player = Board::WHITE_S
      @opponent = Board::BLACK_S
    end
    
    should "be a valid game" do
      assert_valid @game
    end
    
    context "to the top-left corner" do
      
      setup do
        @position = 'aa'
      end
      
      context "on an empty board" do
        
        setup do
          @move = Action::Move.create(:game => @game, :before => @before, :position => @position, :player => @player)
        end
        
        should "be a valid move" do
          assert_valid @move
        end
        
        should "produce a board with the correct placement" do
          assert @move.after
          assert @move.after['aa'].has?(@player)
        end
        
      end
      
      context "when killing another stone" do
        
        setup do
          Action::Move.create(:game => @game, :position => 'ad')
          Action::Move.create(:game => @game, :position => 'ac')
          Action::Move.create(:game => @game, :position => 'bc')
          Action::Move.create(:game => @game, :position => 'ab')
          Action::Move.create(:game => @game, :position => 'bb')
          Action::Move.create(:game => @game, :position => 'bd')
          @was_captured_blacks = @game.captured_blacks
          @move = Action::Move.create(:game => @game, :position => 'aa')
          @game.reload
        end
        
        should "be a valid move" do
          assert_valid @move
        end
        
        should "kill opponent's stones" do
          assert @move.after['ab'].open?
          assert @move.after['ac'].open?
        end
        
        should "increment the number of captured stones" do
          assert_equal(@was_captured_blacks + 2, @game.captured_blacks, @game.inspect)
        end
        
      end
        
      context "when playing into suicide" do
        
        setup do
          @before['ab'] = @opponent
          @before['ba'] = @opponent
          @move = Action::Move.create(:game => @game, :before => @before, :position => @position, :player => @player)
        end
        
        should "not be valid" do
          assert !@move.valid?
        end
        
      end
      
      # TODO: Rule of Ko
    
    end
    
  end
  
end