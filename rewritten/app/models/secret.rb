class Secret < ActiveRecord::Base
  belongs_to(:user)
  belongs_to(:target, :polymorphic => (true))
  validates_uniqueness_of(:secret)
  validates_presence_of(:secret)
  before_validation_on_create(:assign_secret)
  def assign_secret
    self.secret = (__126073541171762__ = (1000000 + rand(9999999))
    if __126073541171762__.kind_of?(Fixnum) then
      RewriteRails::ExtensionMethods::Fixnum.shortened(__126073541171762__)
    else
      __126073541171762__.shortened
    end)
    true
  end
end