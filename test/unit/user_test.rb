require 'test_helper'

class UserTest < ActiveSupport::TestCase
  
  setup do
    User.delete_all
  end
  
  context "an empty email" do
    
    setup do
      @it = User.create(:email=>'')
    end
    
    should "not be valid" do
      assert !@it.valid?
    end
    
  end
  
  context "a malformed email" do
    
    setup do
      @it = User.create(:email=>'asdqeq3e3elm;sdvo9s di')
    end
    
    should "not be valid" do
      assert !@it.valid?
    end
    
  end
  
  context "my email" do
    
    setup do
      @it = User.create(:email=>'reg@braythwayt.com')
    end
    
    should "be valid" do
      assert @it.valid?
    end
    
  end
  
end
