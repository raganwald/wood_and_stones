require File.dirname(__FILE__) + '/../../test_helper'

class Action::SetupStoneTest < ActiveRecord::TestCase
  
  context "placements" do
    
    setup do
      @before = Board.create(:dimension => 13)
      @after = Board.create(:dimension => 13)
      @nineteen = Board.create(:dimension => 19)
      @game = Game.create(:dimension => 13)
      @position = 'aa'
      @player = 'white'
      @opponent = 'black'
      @placement = Action::SetupStone.new(:position => @position, :player => @player, :game => @game)
    end
    
    should "have a valid game" do
      assert @game.valid?, @game.errors.full_messages.inspect
    end
  
    context "with no boards" do
    
      should "be invalid" do
        assert !@placement.valid?
      end
    
    end
  
    context "with both valid boards of the same dimension" do
      
      setup do
        @placement.before = @before
        @placement.after = @after
      end
      
      context "when the position is empty" do
        
        context "and stays empty" do
        
          should "not be valid" do
            assert !@placement.valid?
          end
        
        end
        
        context "and becomes filled with the player's stone" do
        
          setup do
            @after[@position] = @player
          end
        
          should "be valid" do
            assert @placement.valid?, @placement.errors.full_messages
          end
          
        end
        
        context "and becomes filled with the opponent's stone" do
        
          setup do
            @after[@position] = @opponent
          end
        
          should "not be valid" do
            assert !@placement.valid?
          end
          
        end
        
      end
      
      context "when the position is filled with the player's stone" do
        
        setup do
          @before[@position] = @player
        end
        
        context "and stays empty" do
        
          should "not be valid" do
            assert !@placement.valid?
          end
        
        end
        
        context "and becomes filled with the player's stone" do
        
          setup do
            @after[@position] = @player
          end
        
          should "be valid" do
            assert @placement.valid?
          end
          
        end
        
        context "and becomes filled with the opponent's stone" do
        
          setup do
            @after[@position] = @opponent
          end
        
          should "not be valid" do
            assert !@placement.valid?
          end
          
        end
        
      end
      
      context "when the position is filled with the opponent's stone" do
        
        setup do
          @before[@position] = @opponent
        end
        
        context "and stays empty" do
        
          should "not be valid" do
            assert !@placement.valid?
          end
        
        end
        
        context "and becomes filled with the player's stone" do
        
          setup do
            @after[@position] = @player
          end
        
          should "be valid" do
            assert @placement.valid?
          end
          
        end
        
        context "and becomes filled with the opponent's stone" do
        
          setup do
            @after[@position] = @opponent
          end
        
          should "not be valid" do
            assert !@placement.valid?
          end
          
        end
        
      end
      
    end
    
    context "with both valid boards of different dimensions" do
      
      setup do
        @placement.before = @before
        @placement.after = @nineteen
      end
      
      should "not be valid" do
        assert !@placement.valid?
      end
      
    end
    
  end
  
end