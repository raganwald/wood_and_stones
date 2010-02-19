require File.dirname(__FILE__) + '/../../test_helper'

class Action::MoveTest < ActiveRecord::TestCase
  
  context Action::Move do
    
    setup do
      @before = Board.new(9)
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
        
        should "be move one" do
          assert_equal(1, @move.cardinality)
        end
        
      end
      
      context "when killing another stone" do
        
        setup do
          @game = Game.create(:dimension => 9, :black => @adam, :white => @eve)
          Action::Move.create!(:game => @game, :position => 'ad')
          Action::Move.create!(:game => @game, :position => 'ac')
          Action::Move.create!(:game => @game, :position => 'bc')
          Action::Move.create!(:game => @game, :position => 'ab')
          Action::Move.create!(:game => @game, :position => 'bb')
          Action::Move.create!(:game => @game, :position => 'bd')
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
        
        should "be move number seven" do
          assert_equal(7, @move.cardinality)
        end
        
        context "when there's another game going on" do
          
          setup do
            @game2 = Game.create(:dimension => 13, :black => @adam, :white => @eve)
            Action::Move.create!(:game => @game2, :position => 'ad')
            Action::Move.create!(:game => @game2, :position => 'ac')
            Action::Move.create!(:game => @game2, :position => 'bc')
            Action::Move.create!(:game => @game2, :position => 'ab')
            Action::Move.create!(:game => @game2, :position => 'bb')
            Action::Move.create!(:game => @game2, :position => 'bd')
          end
          
          context "the next move" do
            
            setup do
              @move_eight = Action::Move.create(:game => @game, :position => 'ff')
            end
        
            should "be a valid move" do
              assert_valid @move_eight
            end
        
            should "be move number eight" do
              assert_equal(8, @move_eight.cardinality)
            end
            
          end
          
        end
        
      end
        
      context "when playing into suicide" do
        
        setup do
          @game = Game.create!(:dimension=>3, :b=>'b', :w=>'w')
          Action::Move.create!(:game => @game, :position=>'ab')
          Action::Move.create!(:game => @game, :position=>'cc')
          Action::Move.create!(:game => @game, :position=>'ba')
          @move = Action::Move.create(:game => @game, :position=>'aa')
        end
        
        should "not be valid" do
          assert !@move.valid?
        end
        
      end
      
      # TODO: Rule of Ko
    
    end
    
  end
  
end