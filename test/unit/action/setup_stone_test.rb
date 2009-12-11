require File.dirname(__FILE__) + '/../../test_helper'

class Action::SetupStoneTest < ActiveRecord::TestCase
  
  context "placements" do
    
    setup do
      @before = Board.create(:dimension => 13)
      @after = Board.create(:dimension => 13)
      @nineteen = Board.create(:dimension => 19)
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @game = Game.create(:dimension => 13, :black => @adam, :white => @eve)
      @position = 'aa'
      @player = Board::WHITE_S
      @opponent = Board::BLACK_S
      @setup_stone = Action::SetupStone.new(:position => @position, :player => @player, :game => @game)
    end
    
    should "have a valid game" do
      assert @game.valid?, @game.errors.full_messages.inspect
    end
  
    context "with both valid boards of the same dimension" do
      
      setup do
        @setup_stone.before = @before
        @setup_stone.after = @after
      end
      
      context "when the position is empty" do
        
        # context "and stays empty" do
        # 
        #   should "not be valid" do
        #     assert !@setup_stone.valid? # checking validity fires the placement, so this test no longer counts
        #   end
        # 
        # end
        
        context "and becomes filled with the player's stone" do
        
          setup do
            @after[@position] = @player
          end
        
          should "be valid" do
            assert @setup_stone.valid?, @setup_stone.errors.full_messages
          end
          
        end
        
        context "and becomes filled with the opponent's stone" do
        
          setup do
            @after[@position] = @opponent
          end
        
          should "not be valid" do
            assert !@setup_stone.valid?
          end
          
        end
        
      end
      
      context "when the position was filled with the player's stone" do
        
        setup do
          @before[@position] = @player
        end
        
        context "and stays empty" do
        
          should "not be valid" do
            assert !@setup_stone.valid?
          end
        
        end
        
        context "and becomes filled with the player's stone" do
        
          setup do
            @after[@position] = @player
          end
        
          should "not be valid" do
            assert !@setup_stone.valid?
          end
          
        end
        
        context "and becomes filled with the opponent's stone" do
        
          setup do
            @after[@position] = @opponent
          end
        
          should "not be valid" do
            assert !@setup_stone.valid?
          end
          
        end
        
      end
      
      context "when the position is filled with the opponent's stone" do
        
        setup do
          @before[@position] = @opponent
        end
        
        context "and stays empty" do
        
          should "not be valid" do
            assert !@setup_stone.valid?
          end
        
        end
        
        context "and becomes filled with the player's stone" do
        
          setup do
            @after[@position] = @player
          end
        
          should "not be valid" do
            assert !@setup_stone.valid?
          end
          
        end
        
        context "and becomes filled with the opponent's stone" do
        
          setup do
            @after[@position] = @opponent
          end
        
          should "not be valid" do
            assert !@setup_stone.valid?
          end
          
        end
        
      end
      
    end
    
    context "with both valid boards of different dimensions" do
      
      setup do
        @setup_stone.before = @before
        @setup_stone.after = @nineteen
      end
      
      should "not be valid" do
        assert !@setup_stone.valid?
      end
      
    end
    
    context "when just given a before board" do
      
      setup do
        @setup_stone = Action::SetupStone.create(:position => @position, :player => @player, :game => @game, :before => @before)
      end
      
      should "create an after board" do
        assert @setup_stone.after
      end
      
      should "place a stone on the after board" do
        assert @setup_stone.after[@position].has?(@player)
      end
      
    end
    
  end
  
end