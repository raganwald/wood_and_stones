require File.dirname(__FILE__) + '/../test_helper'

class GameTest < ActiveRecord::TestCase
  
  HANDICAP_AMOUNTS = 2..9
  
  def assert_black(across, down, handicap)
    assert @board[across][down].black?, "Expected #{across}-#{down} to be black on a #{@board.dimension} x #{@board.dimension} board with a #{handicap} handicap"
  end

  context "handicaps" do
    
    setup do
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @matrix = Board::DIMENSIONS.inject(Hash.new) do |sizes_to_game_sets, dimension|
        sizes_to_game_sets.merge(
          dimension => HANDICAP_AMOUNTS.inject(Hash.new) do |stones_to_games, handicap|
            stones_to_games.merge(
              handicap => Game.create!(
                :dimension => dimension,
                :handicap => handicap,
                :black => @adam,
                :white => @eve
              ).current_board
            )
          end
        )
      end
    end
    
    should "result in the correct number of black stones on the board" do
      Board::DIMENSIONS.each do |dimension|
        HANDICAP_AMOUNTS.each do |number_of_stones|
          board = @matrix[dimension][number_of_stones]
          blacks, whites = *board.stone_locations
          assert_equal(number_of_stones, blacks.size)
          assert_equal(0, whites.size)
        end
      end
      
    end
    
    context "9x9 boards" do
      
      setup do
        @boards = @matrix[9]
      end
      
      context "with a two stone handicap" do
        
        setup do
          @board = @boards[2]
        end
        
        should "have stones in the lower left and upper right" do
          assert_black(2, 6, 2)
          assert_black(6, 2, 2)
        end
        
      end
      
      context "with a four stone handicap" do
        
        setup do
          @board = @boards[4]
        end
        
        should "have a stones in all four corners" do
          assert_black(2, 6, 4)
          assert_black(6, 2, 4)
          assert_black(2, 2, 4)
          assert_black(6, 6, 4)
        end
        
      end
      
    end
    
    context "19x19 boards" do
      
      setup do
        @boards = @matrix[19]
      end
      
      context "with a five stone handicap" do
        
        setup do
          @board = @boards[5]
        end
        
        should "have stones in the all four corners and the middle" do
          assert_black(3, 15, 5)
          assert_black(15, 3, 5)
          assert_black(3, 3, 5)
          assert_black(15, 15, 5)
          assert_black(9, 9, 5)
        end
        
      end
      
    end
    
  end
  

  context "a new game" do
    
    setup do
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @game = Game.create(:dimension => 9, :black => @adam, :white => @eve)
    end
    
    context "that is about to repeat itself" do
      
      setup do
        Action::Move.create!(:game => @game, :player => 'white', :position => 'aa')
        Action::Move.create!(:game => @game, :player => 'black', :position => 'cb')
        Action::Move.create!(:game => @game, :player => 'white', :position => 'bb')
        Action::Move.create!(:game => @game, :player => 'black', :position => 'da')
        Action::Move.create!(:game => @game, :player => 'white', :position => 'ca')
        @game.reload
      end

      should "produce a valid game" do
        assert @game.valid?
      end
      
      should "produce a set of five boards for the game" do
        assert_equal(5, @game.boards.size)
      end
      
      context "starting with a capture in ko" do
        
        setup do
          Action::Move.create!(:game => @game, :player => 'black', :position => 'ba')
        end
        
        should "produce the correct board" do
          assert_equal [
            ["white", nil,     nil, nil, nil, nil, nil, nil, nil],
            ["black", "white", nil, nil, nil, nil, nil, nil, nil], 
            [nil,     "black", nil, nil, nil, nil, nil, nil, nil], 
            ["black", nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil],
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil], 
            [nil,     nil,     nil, nil, nil, nil, nil, nil, nil]
          ], @game.current_board.to_a
        end

        should "produce a valid game" do
          assert @game.valid?
        end
        
        should "leaving an open place" do
          assert @game.current_board['ca'].open?
        end
      
        context "an attempt to play into ko" do
        
          setup do
            @current_board = @game.current_board
            @move_into_ko = Action::Move.create(:game => @game, :player => 'white', :position => 'ca')
          end
        
          should "be invalid" do
            assert !@move_into_ko.valid?
          end
        
          should "not update the current board" do
            assert_equal(@current_board, @game.current_board)
          end

          should "not invalidate the game" do
            assert @game.valid?
          end
        
        end
        
      end
      
    end
    
  end
  
  context "initializing games for real" do
    
    context "a new game" do
      
      context "with a valid dimension" do
        
        setup do
           assert_nothing_raised(Game::InvalidInitialization) { 
              @adam = User.find_or_create_by_email('adam@garden.org')
              @eve = User.find_or_create_by_email('eve@garden.org')
              @game = Game.create(:dimension => 19, :black => @adam, :white => @eve) 
            }
        end
        
        should "be valid" do
          assert @game.valid?, @game.errors.full_messages.inspect
        end
        
        should "have a valid current_board" do
          assert @game.current_board.valid?, @game.current_board.errors.full_messages.inspect
        end
        
      end
      
      should "require a dimension" do
        assert_raise(Game::InvalidInitialization) { Game.create }
      end
      
      should "barf when given an invalid dimension" do
        assert !Game.new(:dimension => 6).valid?
      end
      
    end
    
  end
  
end