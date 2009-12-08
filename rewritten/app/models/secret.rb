class Secret < ActiveRecord::Base
  belongs_to(:user)
  belongs_to(:target, :polymorphic => (true))
  validates_uniqueness_of(:secret)
  validates_presence_of(:secret)
  before_validation_on_create(:assign_secret)
  def assign_secret
    self.secret = (__126030928181251__ = (1000000 + rand(9999999))
    if __126030928181251__.kind_of?(Fixnum) then
      RewriteRails::ExtensionMethods::Fixnum.shortened(__126030928181251__)
    else
      __126030928181251__.shortened
    end)
    true
  end
end