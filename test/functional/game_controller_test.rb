require File.dirname(__FILE__) + '/../test_helper'

class GameControllerTest < ActionController::TestCase
  
  context "given a nascent game" do
    
    setup do
      @adam = User.find_or_create_by_email('adam@garden.org')
      @eve = User.find_or_create_by_email('eve@garden.org')
      @game = Game.create!(
        :dimension => 9,
        :handicap => 5,
        :black => @adam,
        :even => @eve
      )
    end
    
    
  end
  
end